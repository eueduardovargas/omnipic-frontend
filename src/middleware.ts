import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';
import { locales, defaultLocale } from './i18n/config';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: 'always',
});

/**
 * Routes that require an authenticated user. The `[locale]` prefix is
 * prepended automatically when matching.
 */
const PROTECTED_PATHS = ['/dashboard', '/account', '/settings'];

function isProtected(pathname: string): boolean {
  // Strip the locale prefix before matching (e.g. `/pt-BR/dashboard` → `/dashboard`).
  const stripped = pathname.replace(
    new RegExp(`^/(${locales.join('|')})(?=/|$)`),
    '',
  );
  return PROTECTED_PATHS.some(
    (prefix) => stripped === prefix || stripped.startsWith(`${prefix}/`),
  );
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtected(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const localeMatch = pathname.match(new RegExp(`^/(${locales.join('|')})`));
      const locale = localeMatch?.[1] ?? defaultLocale;
      const signInUrl = new URL(`/${locale}/auth`, request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
