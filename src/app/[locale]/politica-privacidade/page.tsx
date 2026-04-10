'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Shield, Send, CheckCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const t = useTranslations('legal');
  const [deletionType, setDeletionType] = useState('photos');
  const [submitted, setSubmitted] = useState(false);

  const sections = [
    { title: t('dataController'), content: t('dataControllerText') },
    { title: t('dataProtectionOfficer'), content: t('dpoText') },
    { title: t('dataCollection'), content: t('dataCollectionText') },
    { title: t('legalBasis'), content: t('legalBasisText') },
    { title: t('dataSubjectRights'), content: t('dataSubjectRightsText') },
    { title: t('dataRetention'), content: t('dataRetentionText') },
  ];

  return (
    <div className="pt-20 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-accent-violet" />
            <h1 className="text-3xl md:text-4xl font-bold">{t('privacyTitle')}</h1>
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

          {/* Data Deletion Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <h2 className="text-xl font-semibold mb-4">{t('dataDeletion')}</h2>
            <div className="text-muted leading-relaxed whitespace-pre-line mb-8">{t('dataDeletionText')}</div>

            <h3 className="text-lg font-semibold mb-6">{t('deletionRequestTitle')}</h3>

            {submitted ? (
              <div className="flex items-center gap-3 text-accent-emerald">
                <CheckCircle className="w-6 h-6" />
                <p>{t('deletionSuccess')}</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('deletionEmail')}</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-background border border-border rounded-btn px-4 py-3 text-sm focus:outline-none focus:border-accent-violet transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('deletionType')}</label>
                  <div className="flex flex-wrap gap-3">
                    {(['photos', 'account', 'both'] as const).map((type) => {
                      const labels = { photos: t('deletionPhotos'), account: t('deletionAccount'), both: t('deletionBoth') };
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setDeletionType(type)}
                          className={`px-4 py-2 rounded-btn text-sm border transition-colors ${
                            deletionType === type
                              ? 'border-accent-violet bg-accent-violet/20 text-white'
                              : 'border-border text-muted hover:border-accent-violet/50'
                          }`}
                        >
                          {labels[type]}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-accent text-white font-medium px-6 py-3 rounded-btn hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" /> {t('deletionSubmit')}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
