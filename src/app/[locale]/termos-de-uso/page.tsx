'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermsOfUsePage() {
  const t = useTranslations('legal');

  const sections = [
    { title: t('termsContent.acceptance'), content: t('termsContent.acceptanceText') },
    { title: t('termsContent.serviceDescription'), content: t('termsContent.serviceDescriptionText') },
    { title: t('termsContent.acceptableUse'), content: t('termsContent.acceptableUseText') },
    { title: t('termsContent.intellectualProperty'), content: t('termsContent.intellectualPropertyText') },
    { title: t('termsContent.liability'), content: t('termsContent.liabilityText') },
    { title: t('termsContent.termination'), content: t('termsContent.terminationText') },
    { title: t('termsContent.applicableLaw'), content: t('termsContent.applicableLawText') },
  ];

  return (
    <div className="pt-20 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-accent-violet" />
            <h1 className="text-3xl md:text-4xl font-bold">{t('termsTitle')}</h1>
          </div>
          <p className="text-muted">{t('lastUpdated')}: 01/04/2026</p>
        </motion.div>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <div className="text-muted leading-relaxed whitespace-pre-line">{section.content}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
