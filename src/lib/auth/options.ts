/**
 * NextAuth configuration for OmniPic.
 *
 * - Uses Google OAuth as the primary provider.
 * - On sign-in, upserts the user row into `public.users` (via the Supabase
 *   admin client) so the rest of the app can join on `auth.uid()`.
 * - JWT session strategy keeps middleware lightweight — we put the
 *   user id + profile fields on the token so server components can
 *   read them without a round trip to Supabase.
 */

import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

const googleClientId =
  process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        const supabase = getSupabaseAdminClient();
        await supabase.from('users').upsert(
          {
            email: user.email,
            name: user.name ?? null,
            avatar_url: user.image ?? null,
            provider: account?.provider ?? 'google',
          },
          { onConflict: 'email' },
        );
        return true;
      } catch (e) {
        console.error('[auth] Failed to upsert user:', e);
        // Allow sign-in even if the Supabase upsert fails, so users
        // aren't locked out by a transient DB error.
        return true;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email ?? token.email;
        token.name = user.name ?? token.name;
        token.picture = user.image ?? token.picture;
      }

      if (account?.provider) {
        token.provider = account.provider;
      }

      // Look up the Supabase user id once and cache it on the token.
      if (!token.supabaseUserId && token.email) {
        try {
          const supabase = getSupabaseAdminClient();
          const { data } = await supabase
            .from('users')
            .select('id')
            .eq('email', token.email as string)
            .maybeSingle();
          if (data?.id) token.supabaseUserId = data.id;
        } catch (e) {
          console.error('[auth] Failed to load supabase user id:', e);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.supabaseUserId as string | undefined) ?? '';
        session.user.provider = (token.provider as string | undefined) ?? null;
      }
      return session;
    },
  },
};
