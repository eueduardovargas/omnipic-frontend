/**
 * Stripe server client + plan configuration.
 * Only imported from server code (API routes, server actions).
 */

import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY env var');
  }

  stripeInstance = new Stripe(secretKey, {
    // apiVersion is auto-pinned by the SDK; omit to use the SDK's default.
    typescript: true,
    appInfo: {
      name: 'OmniPic',
      version: '1.0.0',
    },
  });

  return stripeInstance;
}

export type PlanKey = 'weekly' | 'monthly' | 'annual';

export interface PlanConfig {
  key: PlanKey;
  productId: string;
  priceId: string;
  interval: 'week' | 'month' | 'year';
}

export function getPlanConfig(key: PlanKey): PlanConfig {
  const map: Record<PlanKey, PlanConfig> = {
    weekly: {
      key: 'weekly',
      productId: process.env.STRIPE_PRODUCT_WEEKLY ?? 'prod_UIgGvMOGagd29p',
      priceId: process.env.STRIPE_PRICE_WEEKLY ?? '',
      interval: 'week',
    },
    monthly: {
      key: 'monthly',
      productId: process.env.STRIPE_PRODUCT_MONTHLY ?? 'prod_UIgHNZVLZj4YB3',
      priceId: process.env.STRIPE_PRICE_MONTHLY ?? '',
      interval: 'month',
    },
    annual: {
      key: 'annual',
      productId: process.env.STRIPE_PRODUCT_ANNUAL ?? 'prod_UIgIUYOhXrjGYJ',
      priceId: process.env.STRIPE_PRICE_ANNUAL ?? '',
      interval: 'year',
    },
  };

  const plan = map[key];
  if (!plan.priceId) {
    throw new Error(
      `Missing Stripe price id for plan "${key}". Set STRIPE_PRICE_${key.toUpperCase()} in .env.local`,
    );
  }
  return plan;
}

/**
 * Maps a Stripe product id back to our internal plan key.
 * Used by the webhook handler to persist subscriptions.
 */
export function productIdToPlanKey(productId: string | null | undefined): PlanKey | null {
  if (!productId) return null;
  const map: Record<string, PlanKey> = {
    [process.env.STRIPE_PRODUCT_WEEKLY ?? 'prod_UIgGvMOGagd29p']: 'weekly',
    [process.env.STRIPE_PRODUCT_MONTHLY ?? 'prod_UIgHNZVLZj4YB3']: 'monthly',
    [process.env.STRIPE_PRODUCT_ANNUAL ?? 'prod_UIgIUYOhXrjGYJ']: 'annual',
  };
  return map[productId] ?? null;
}
