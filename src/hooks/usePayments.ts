'use client';

/**
 * usePayments — paginated list of the user's payment history.
 */

import { useCallback, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { PaymentRow } from '@/lib/supabase/types';
import { useSupabaseUser } from './useSupabaseUser';

interface UsePaymentsOptions {
  limit?: number;
}

interface UsePaymentsResult {
  payments: PaymentRow[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function usePayments(options: UsePaymentsOptions = {}): UsePaymentsResult {
  const { limit = 25 } = options;
  const { authUser } = useSupabaseUser();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!authUser) {
      setPayments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: fetchError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;
      setPayments(data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [authUser, limit]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { payments, loading, error, refresh };
}
