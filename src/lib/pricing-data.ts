import { Locale, PriceByLocale } from '@/types';

export const prices: Record<string, Record<string, PriceByLocale>> = {
  free: {
    'pt-BR': { monthly: 0, annual: 0, currency: 'BRL', symbol: 'R$' },
    en: { monthly: 0, annual: 0, currency: 'USD', symbol: '$' },
    'en-GB': { monthly: 0, annual: 0, currency: 'USD', symbol: '$' },
    es: { monthly: 0, annual: 0, currency: 'EUR', symbol: '€' },
    'es-419': { monthly: 0, annual: 0, currency: 'USD', symbol: '$' },
    de: { monthly: 0, annual: 0, currency: 'EUR', symbol: '€' },
  },
  pro: {
    'pt-BR': { monthly: 29.9, annual: 17.9, currency: 'BRL', symbol: 'R$' },
    en: { monthly: 9.99, annual: 5.99, currency: 'USD', symbol: '$' },
    'en-GB': { monthly: 7.99, annual: 4.99, currency: 'USD', symbol: '$' },
    es: { monthly: 8.99, annual: 5.49, currency: 'EUR', symbol: '€' },
    'es-419': { monthly: 7.99, annual: 4.99, currency: 'USD', symbol: '$' },
    de: { monthly: 8.99, annual: 5.49, currency: 'EUR', symbol: '€' },
  },
  business: {
    'pt-BR': { monthly: 89.9, annual: 53.9, currency: 'BRL', symbol: 'R$' },
    en: { monthly: 29.99, annual: 17.99, currency: 'USD', symbol: '$' },
    'en-GB': { monthly: 24.99, annual: 14.99, currency: 'USD', symbol: '$' },
    es: { monthly: 24.99, annual: 14.99, currency: 'EUR', symbol: '€' },
    'es-419': { monthly: 19.99, annual: 11.99, currency: 'USD', symbol: '$' },
    de: { monthly: 24.99, annual: 14.99, currency: 'EUR', symbol: '€' },
  },
};

export function getPrice(plan: string, locale: string, isAnnual: boolean): { value: number; symbol: string } {
  const p = prices[plan]?.[locale] || prices[plan]?.['en'];
  if (!p) return { value: 0, symbol: '$' };
  return { value: isAnnual ? p.annual : p.monthly, symbol: p.symbol };
}

export function formatPrice(value: number, symbol: string): string {
  if (value === 0) return `${symbol} 0`;
  return `${symbol} ${value.toFixed(2).replace('.', ',')}`;
}
