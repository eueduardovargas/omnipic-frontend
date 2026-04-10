/**
 * POST /api/stripe/portal
 * Creates a Stripe billing portal session so the user can manage
 * payment methods, update billing info, and cancel/resume subscriptions.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getStripe } from '@/lib/stripe/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const supabase = getSupabaseAdminClient();
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .maybeSingle();
    const userId = (user as { id?: string } | null)?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .not('stripe_customer_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const customerId = (sub as { stripe_customer_id?: string | null } | null)
      ?.stripe_customer_id;
    if (!customerId) {
      return NextResponse.json(
        { error: 'No Stripe customer on file' },
        { status: 404 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as { locale?: string };
    const locale = typeof body.locale === 'string' ? body.locale : 'pt-BR';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

    const stripe = getStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/${locale}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (e) {
    console.error('[stripe/portal] error', e);
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
