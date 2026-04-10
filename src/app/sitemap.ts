import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { services } from '@/lib/services-data';

const BASE_URL = 'https://omnipic.net';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  const pages = [
    '',
    '/planos',
    '/auth',
    '/memorias-vivas',
    '/politica-privacidade',
    '/termos-de-uso',
    '/politica-cookies',
  ];

  for (const locale of locales) {
    for (const page of pages) {
      routes.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${page}`])
          ),
        },
      });
    }

    for (const service of services) {
      routes.push({
        url: `${BASE_URL}/${locale}/servicos/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/servicos/${service.slug}`])
          ),
        },
      });
    }
  }

  return routes;
}
