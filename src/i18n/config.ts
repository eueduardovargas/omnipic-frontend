import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = [
  'pt-BR',
  'en',
  'en-GB',
  'es',
  'es-419',
  'de',
  'fr',
  'it',
  'ja',
  'zh',
  'ru',
] as const;

export const defaultLocale = 'pt-BR';

export type Locale = (typeof locales)[number];

export const localeMetadata: Record<Locale, { label: string; flag: string; nativeName: string }> = {
  'pt-BR': { label: 'Português (BR)', flag: '🇧🇷', nativeName: 'Português' },
  en: { label: 'English (US)', flag: '🇺🇸', nativeName: 'English' },
  'en-GB': { label: 'English (UK)', flag: '🇬🇧', nativeName: 'English' },
  es: { label: 'Español (ES)', flag: '🇪🇸', nativeName: 'Español' },
  'es-419': { label: 'Español (LA)', flag: '🌎', nativeName: 'Español' },
  de: { label: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
  fr: { label: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  it: { label: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano' },
  ja: { label: '日本語', flag: '🇯🇵', nativeName: '日本語' },
  zh: { label: '中文', flag: '🇨🇳', nativeName: '中文' },
  ru: { label: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
};

export default getRequestConfig(async ({ locale }) => {
  // Fallback to defaultLocale if locale is undefined
  const safeLocale = locale && locales.includes(locale as Locale) ? locale : defaultLocale;
  if (!locales.includes(safeLocale as Locale)) notFound();

  return {
    locale: safeLocale,
    messages: (await import(`./messages/${safeLocale}.json`)).default,
  };
});
