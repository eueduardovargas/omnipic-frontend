'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Hero from '@/components/home/Hero';
import HomeServices from '@/components/home/HomeServices';
import Industries from '@/components/home/Industries';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/shared/CTASection';

export default function HomePage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('ctaFinal');

  return (
    <>
      <Hero locale={locale} />
      <HomeServices locale={locale} />
      <Industries />
      <Testimonials />
      <CTASection
        title={t('title')}
        subtitle={t('subtitle')}
        cta={t('cta')}
        href={`/${locale}/auth`}
      />
    </>
  );
}
