'use client';

/**
 * useSubscription — reads the current user's latest subscription row.
 * Returns `null` for the subscription when the user has no active plan.
 */

import { useCallback, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { SubscriptionRow } from '@/lib/supabase/types';
import { useSupabaseUser } from './useSupabaseUser';

interface UseSubscriptionResult {
  subscription: SubscriptionRow | null;
  isActive: boolean;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionResult {
  const { authUser } = useSupabaseUser();
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!authUser) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;
      setSubscription(data ?? null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const isActive =
    !!subscription &&
    (subscription.status === 'active' || subscription.status === 'trialing');

  return { subscription, isActive, loading, error, refresh };
}
