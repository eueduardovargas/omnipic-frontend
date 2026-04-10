import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import { PlansModalProvider } from '@/components/shared/PlansModalContext';
import AuthSessionProvider from '@/components/providers/AuthSessionProvider';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  let messages: Record<string, unknown>;
  try {
    messages = (await import(`@/i18n/messages/${params.locale}.json`)).default;
  } catch {
    return {};
  }
  const metadata = messages.metadata as { title: string; description: string } | undefined;
  return {
    title: metadata?.title || 'OmniPic',
    description: metadata?.description || '',
    openGraph: {
      title: metadata?.title,
      description: metadata?.description,
      siteName: 'OmniPic',
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale as (typeof locales)[number])) {
    notFound();
  }

  unstable_setRequestLocale(params.locale);
  const messages = await getMessages();

  return (
    <html lang={params.locale} className="dark">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <AuthSessionProvider>
            <PlansModalProvider locale={params.locale}>
              <Navbar locale={params.locale} />
              <main className="min-h-screen">{children}</main>
              <Footer locale={params.locale} />
              <CookieBanner locale={params.locale} />
            </PlansModalProvider>
          </AuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
