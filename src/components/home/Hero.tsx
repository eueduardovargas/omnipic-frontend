'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider';

interface HeroProps {
  locale: string;
}

export default function Hero({ locale }: HeroProps) {
  const t = useTranslations('hero');
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [t('tabs.portrait'), t('tabs.landscape'), t('tabs.oldPhoto')];
  const badges: string[] = t.raw('badges');

  // Image URLs for each tab
  const beforeImages = [
    `https://placehold.co/800x600/141414/666666?text=${encodeURIComponent(tabs[0])}+Antes`,
    `https://placehold.co/800x600/141414/666666?text=${encodeURIComponent(tabs[1])}+Antes`,
    'https://files.manuscdn.com/user_upload_by_module/session_file/310519663383332386/bqtyDmQVURyKynlK.jpg'
  ];
  const afterImages = [
    `https://placehold.co/800x600/141414/7C3AED?text=${encodeURIComponent(tabs[0])}+Depois`,
    `https://placehold.co/800x600/141414/7C3AED?text=${encodeURIComponent(tabs[1])}+Depois`,
    'https://files.manuscdn.com/user_upload_by_module/session_file/310519663383332386/EuZTIHsbOhFfbEkY.png'
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.08),transparent_60%)]" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance">
              {t('headline')}
            </h1>
            <p className="text-lg text-muted mb-8 max-w-xl leading-relaxed">
              {t('subtitle')}
            </p>
            <Link
              href={`/${locale}/auth`}
              className="inline-block bg-gradient-accent text-white font-semibold px-8 py-4 rounded-btn text-lg hover:opacity-90 transition-opacity shadow-lg shadow-accent-violet/25"
            >
              {t('cta')}
            </Link>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mt-8">
              {badges.map((badge, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-muted"
                >
                  {badge}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right — Product Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    activeTab === i
                      ? 'bg-gradient-accent text-white'
                      : 'bg-white/5 text-muted hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <BeforeAfterSlider
              beforeSrc={beforeImages[activeTab]}
              afterSrc={afterImages[activeTab]}
              height="h-[350px] md:h-[450px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
