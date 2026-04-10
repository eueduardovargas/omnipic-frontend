'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface CookieBannerProps {
  locale: string;
}

export default function CookieBanner({ locale }: CookieBannerProps) {
  const t = useTranslations('cookieBanner');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('omnipic-cookies');
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('omnipic-cookies', 'accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('omnipic-cookies', 'rejected');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-5xl mx-auto bg-card border border-border rounded-card p-6 flex flex-col sm:flex-row items-center gap-4 shadow-2xl">
            <p className="text-sm text-muted flex-1">
              {t('message')}{' '}
              <Link href={`/${locale}/politica-cookies`} className="text-accent-violet hover:underline">
                {t('cookiePolicy')}
              </Link>.
            </p>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={handleReject} className="px-4 py-2 text-sm border border-border rounded-btn hover:bg-white/10 transition-colors">
                {t('reject')}
              </button>
              <button onClick={handleAccept} className="px-4 py-2 text-sm bg-gradient-accent text-white rounded-btn hover:opacity-90 transition-opacity">
                {t('accept')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
