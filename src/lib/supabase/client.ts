/**
 * Supabase browser client.
 * Use this in "use client" components and React hooks.
 * Never import the service-role key here — it would leak to the browser.
 *
 * NOTE: We intentionally use an untyped client. The SDK's generic
 * Database type system is strict about schema shape; manual row typing
 * via `@/lib/supabase/types` works well enough for our app while
 * keeping the client ergonomic. Cast results with `as UserRow` etc.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
  }

  browserClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}
