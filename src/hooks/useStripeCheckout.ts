'use client';

/**
 * useStripeCheckout — posts to `/api/stripe/checkout` and redirects the
 * user to the Stripe-hosted checkout URL. Handles the "not authenticated"
 * case by bouncing the user to /auth with the intended plan preserved.
 */

import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export type PlanKey = 'weekly' | 'monthly' | 'annual';

interface UseStripeCheckoutResult {
  startCheckout: (plan: PlanKey) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useStripeCheckout(locale: string): UseStripeCheckoutResult {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(
    async (plan: PlanKey) => {
      setError(null);

      // Not signed in → bounce to auth with callback + plan preserved.
      if (status !== 'authenticated') {
        router.push(
          `/${locale}/auth?plan=${plan}&callbackUrl=${encodeURIComponent(
            `/${locale}/planos?plan=${plan}`,
          )}`,
        );
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, locale }),
        });

        const data = (await res.json()) as { url?: string; error?: string };

        if (!res.ok || !data.url) {
          throw new Error(data.error ?? 'Failed to start checkout');
        }

        window.location.href = data.url;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setLoading(false);
      }
    },
    [locale, router, status],
  );

  return { startCheckout, loading, error };
}
