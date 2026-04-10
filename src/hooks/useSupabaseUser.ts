'use client';

/**
 * useSupabaseUser — reads the current Supabase auth session and the
 * corresponding row from `public.users`. Subscribes to auth state changes.
 */

import { useCallback, useEffect, useState } from 'react';
import type { User as AuthUser } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { UserRow } from '@/lib/supabase/types';

interface UseSupabaseUserResult {
  authUser: AuthUser | null;
  profile: UserRow | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useSupabaseUser(): UseSupabaseUserResult {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProfile = useCallback(async (user: AuthUser | null) => {
    if (!user) {
      setProfile(null);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const { data, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchError) {
      setError(fetchError);
      return;
    }

    setProfile(data ?? null);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      setAuthUser(data.user ?? null);
      await loadProfile(data.user ?? null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setAuthUser(null);
    setProfile(null);
  }, []);

  useEffect(() => {
    void refresh();

    const supabase = getSupabaseBrowserClient();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      void loadProfile(session?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [refresh, loadProfile]);

  return { authUser, profile, loading, error, refresh, signOut };
}
