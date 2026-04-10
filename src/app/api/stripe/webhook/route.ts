/**
 * POST /api/stripe/webhook
 * Handles Stripe subscription + payment events and keeps the
 * Supabase subscription/payment tables in sync.
 *
 * Events handled:
 *   - checkout.session.completed
 *   - customer.subscription.created
 *   - customer.subscription.updated
 *   - customer.subscription.deleted
 *   - invoice.paid
 *   - invoice.payment_failed
 */

import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { getStripe, productIdToPlanKey } from '@/lib/stripe/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import type { SubscriptionStatus } from '@/lib/supabase/types';

// Stripe requires the raw request body to verify the signature.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EVENT_HANDLERS: Record<string, (event: Stripe.Event) => Promise<void>> = {
  'checkout.session.completed': handleCheckoutCompleted,
  'customer.subscription.created': handleSubscriptionUpserted,
  'customer.subscription.updated': handleSubscriptionUpserted,
  'customer.subscription.deleted': handleSubscriptionDeleted,
  'invoice.paid': handleInvoicePaid,
  'invoice.payment_failed': handleInvoiceFailed,
};

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'Missing STRIPE_WEBHOOK_SECRET' },
      { status: 500 },
    );
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    console.error('[stripe/webhook] signature verification failed:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const handler = EVENT_HANDLERS[event.type];
  if (!handler) {
    // Return 200 for unhandled events so Stripe doesn't retry them forever.
    return NextResponse.json({ received: true, handled: false });
  }

  try {
    await handler(event);
    return NextResponse.json({ received: true, handled: true });
  } catch (e) {
    console.error(`[stripe/webhook] handler error for ${event.type}:`, e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Handler error' },
      { status: 500 },
    );
  }
}

// ============================================================================
// Helpers
// ============================================================================

function toIsoOrNull(ts: number | null | undefined): string | null {
  return typeof ts === 'number' ? new Date(ts * 1000).toISOString() : null;
}

async function resolveUserId(
  customerId: string | null,
  metadataUserId?: string | null,
  email?: string | null,
): Promise<string | null> {
  if (metadataUserId) return metadataUserId;

  const supabase = getSupabaseAdminClient();

  if (customerId) {
    const { data } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .limit(1)
      .maybeSingle();
    if (data?.user_id) return data.user_id;
  }

  if (email) {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    if (data?.id) return data.id;
  }

  return null;
}

// ============================================================================
// Event handlers
// ============================================================================

async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.mode !== 'subscription' || !session.subscription) return;

  const stripe = getStripe();
  const subscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : (session.subscription as Stripe.Subscription).id;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price.product'],
  });

  await upsertSubscription(subscription, {
    metadataUserId: session.metadata?.supabase_user_id ?? null,
    email: session.customer_details?.email ?? null,
  });
}

async function handleSubscriptionUpserted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  await upsertSubscription(subscription, {
    metadataUserId: subscription.metadata?.supabase_user_id ?? null,
  });
}

async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const supabase = getSupabaseAdminClient();
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: false,
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleInvoicePaid(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  await recordPayment(invoice, 'succeeded');
}

async function handleInvoiceFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  await recordPayment(invoice, 'failed');
}

// ============================================================================
// Writers
// ============================================================================

async function upsertSubscription(
  subscription: Stripe.Subscription,
  ctx: { metadataUserId?: string | null; email?: string | null },
) {
  const supabase = getSupabaseAdminClient();
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer?.id ?? null;

  const userId = await resolveUserId(customerId, ctx.metadataUserId, ctx.email);
  if (!userId) {
    console.warn(
      `[stripe/webhook] could not resolve user for subscription ${subscription.id}`,
    );
    return;
  }

  const item = subscription.items.data[0];
  const price = item?.price;
  const product =
    typeof price?.product === 'string'
      ? price.product
      : (price?.product as Stripe.Product | null)?.id ?? null;
  const planKey = productIdToPlanKey(product);

  if (!planKey) {
    console.warn(
      `[stripe/webhook] unknown product ${product} for subscription ${subscription.id}`,
    );
    return;
  }

  // In Stripe API 2025-03+, `current_period_start/end` live on the
  // subscription item rather than the top-level subscription object.
  const itemAny = item as unknown as {
    current_period_start?: number | null;
    current_period_end?: number | null;
  };
  const subAny = subscription as unknown as {
    current_period_start?: number | null;
    current_period_end?: number | null;
  };
  const periodStart =
    itemAny.current_period_start ?? subAny.current_period_start ?? null;
  const periodEnd = itemAny.current_period_end ?? subAny.current_period_end ?? null;

  await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      plan_type: planKey,
      status: subscription.status as SubscriptionStatus,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_product_id: product,
      stripe_price_id: price?.id ?? null,
      current_period_start: toIsoOrNull(periodStart),
      current_period_end: toIsoOrNull(periodEnd),
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      canceled_at: toIsoOrNull(subscription.canceled_at),
    },
    { onConflict: 'stripe_subscription_id' },
  );
}

async function recordPayment(
  invoice: Stripe.Invoice,
  status: 'succeeded' | 'failed',
) {
  const supabase = getSupabaseAdminClient();
  const customerId =
    typeof invoice.customer === 'string'
      ? invoice.customer
      : (invoice.customer as Stripe.Customer | null)?.id ?? null;

  const userId = await resolveUserId(
    customerId,
    invoice.metadata?.supabase_user_id ?? null,
    invoice.customer_email ?? null,
  );
  if (!userId) return;

  // In Stripe API 2025-03+, the invoice's `subscription` field moved into
  // `parent.subscription_details.subscription`, and `payment_intent` is no
  // longer on the top-level invoice. We normalise both here for older
  // libraries and for forward compatibility.
  const invoiceAny = invoice as unknown as {
    subscription?: string | Stripe.Subscription | null;
    payment_intent?: string | Stripe.PaymentIntent | null;
    parent?: {
      subscription_details?: {
        subscription?: string | Stripe.Subscription | null;
      } | null;
    } | null;
  };

  const rawSub =
    invoiceAny.subscription ??
    invoiceAny.parent?.subscription_details?.subscription ??
    null;

  let subscriptionId: string | null = null;
  if (rawSub) {
    const stripeSubId = typeof rawSub === 'string' ? rawSub : rawSub.id;
    const { data } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', stripeSubId)
      .maybeSingle();
    subscriptionId = (data as { id?: string } | null)?.id ?? null;
  }

  const paymentIntentId = invoiceAny.payment_intent
    ? typeof invoiceAny.payment_intent === 'string'
      ? invoiceAny.payment_intent
      : invoiceAny.payment_intent.id
    : null;

  await supabase.from('payments').insert({
    user_id: userId,
    subscription_id: subscriptionId,
    stripe_payment_intent_id: paymentIntentId,
    stripe_invoice_id: invoice.id,
    amount_cents: invoice.amount_paid ?? invoice.amount_due ?? 0,
    currency: invoice.currency ?? 'usd',
    status,
    description: invoice.description ?? invoice.lines.data[0]?.description ?? null,
    receipt_url: invoice.hosted_invoice_url ?? null,
  });
}
