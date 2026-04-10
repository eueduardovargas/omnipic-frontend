/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout session for the signed-in user and returns
 * the hosted checkout URL. The plan key is validated server-side.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getStripe, getPlanConfig, type PlanKey } from '@/lib/stripe/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

const VALID_PLAN_KEYS: readonly PlanKey[] = ['weekly', 'monthly', 'annual'];

function isValidPlanKey(value: unknown): value is PlanKey {
  return typeof value === 'string' && VALID_PLAN_KEYS.includes(value as PlanKey);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in to start a checkout.' },
        { status: 401 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      plan?: string;
      locale?: string;
    };

    if (!isValidPlanKey(body.plan)) {
      return NextResponse.json(
        { error: 'Invalid or missing `plan` parameter.' },
        { status: 400 },
      );
    }

    const locale = typeof body.locale === 'string' ? body.locale : 'pt-BR';
    const plan = getPlanConfig(body.plan);
    const stripe = getStripe();

    // Look up or create a Stripe customer so subsequent purchases
    // keep the same customer record.
    const supabase = getSupabaseAdminClient();
    const { data: userRow } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .maybeSingle();

    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userRow?.id ?? '')
      .not('stripe_customer_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let customerId = existingSub?.stripe_customer_id ?? undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name ?? undefined,
        metadata: {
          supabase_user_id: userRow?.id ?? '',
        },
      });
      customerId = customer.id;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${appUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${locale}/checkout/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      subscription_data: {
        metadata: {
          plan_key: plan.key,
          supabase_user_id: userRow?.id ?? '',
        },
      },
      metadata: {
        plan_key: plan.key,
        supabase_user_id: userRow?.id ?? '',
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (e) {
    console.error('[stripe/checkout] error', e);
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
