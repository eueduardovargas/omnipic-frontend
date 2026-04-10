'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Cookie } from 'lucide-react';

export default function CookiePolicyPage() {
  const t = useTranslations('legal');

  const sections = [
    { title: t('cookiesContent.whatAreCookies'), content: t('cookiesContent.whatAreCookiesText') },
    { title: t('cookiesContent.typesOfCookies'), content: '' },
  ];

  const cookieTypes = [
    { title: t('cookiesContent.essential'), content: t('cookiesContent.essentialText'), color: 'accent-emerald' },
    { title: t('cookiesContent.analytics'), content: t('cookiesContent.analyticsText'), color: 'accent-blue' },
    { title: t('cookiesContent.marketing'), content: t('cookiesContent.marketingText'), color: 'accent-violet' },
  ];

  return (
    <div className="pt-20 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-8 h-8 text-accent-violet" />
            <h1 className="text-3xl md:text-4xl font-bold">{t('cookiesTitle')}</h1>
          </div>
          <p className="text-muted">{t('lastUpdated')}: 01/04/2026</p>
        </motion.div>

        <div className="space-y-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl font-semibold mb-4">{t('cookiesContent.whatAreCookies')}</h2>
            <p className="text-muted leading-relaxed">{t('cookiesContent.whatAreCookiesText')}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl font-semibold mb-6">{t('cookiesContent.typesOfCookies')}</h2>
            <div className="space-y-4">
              {cookieTypes.map((type, i) => (
                <div key={i} className="glass-card p-6">
                  <h3 className="font-semibold mb-2">{type.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{type.content}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl font-semibold mb-4">{t('cookiesContent.manageCookies')}</h2>
            <p className="text-muted leading-relaxed">{t('cookiesContent.manageCookiesText')}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
