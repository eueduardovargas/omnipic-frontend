'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Instagram, Youtube, Twitter } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import OmnipicLogo from './OmnipicLogo';
import { services } from '@/lib/services-data';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const ts = useTranslations('services');

  const enhanceServices = services.filter((s) => s.category === 'enhancement').slice(0, 6);
  const generativeServices = services.filter((s) => s.category === 'generative' || s.category === 'video');

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4 group">
              <OmnipicLogo className="w-9 h-9 transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold">
                Omni<span className="bg-gradient-to-r from-accent-violet to-accent-blue bg-clip-text text-transparent">Pic</span>
              </span>
            </Link>
            <p className="text-muted text-sm mb-6">{t('description')}</p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="text-muted hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" aria-label="YouTube" className="text-muted hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
              <a href="#" aria-label="Twitter" className="text-muted hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Enhance */}
          <div>
            <h4 className="font-semibold mb-4">{t('enhance')}</h4>
            <ul className="space-y-2.5">
              {enhanceServices.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${locale}/servicos/${s.slug}`} className="text-muted text-sm hover:text-white transition-colors">
                    {ts(s.titleKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Generative AI */}
          <div>
            <h4 className="font-semibold mb-4">{t('generativeAI')}</h4>
            <ul className="space-y-2.5">
              {generativeServices.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${locale}/servicos/${s.slug}`} className="text-muted text-sm hover:text-white transition-colors">
                    {ts(s.titleKey)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/${locale}/memorias-vivas`} className="text-muted text-sm hover:text-white transition-colors">
                  Memorias Vivas
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">{t('resources')}</h4>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}/suporte`} className="text-muted text-sm hover:text-white transition-colors">{t('support')}</Link></li>
              <li><a href="#" className="text-muted text-sm hover:text-white transition-colors">{t('blog')}</a></li>
              <li><Link href={`/${locale}/suporte`} className="text-muted text-sm hover:text-white transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{t('legal')}</h4>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}/politica-privacidade`} className="text-muted text-sm hover:text-white transition-colors">{t('privacy')}</Link></li>
              <li><Link href={`/${locale}/termos-de-uso`} className="text-muted text-sm hover:text-white transition-colors">{t('terms')}</Link></li>
              <li><Link href={`/${locale}/politica-cookies`} className="text-muted text-sm hover:text-white transition-colors">{t('cookies')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-muted text-sm">{t('copyright')}</p>
            <p className="text-muted text-sm">{t('madeWith')}</p>
          </div>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </footer>
  );
}
