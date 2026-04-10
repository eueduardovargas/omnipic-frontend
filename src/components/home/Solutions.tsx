'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider';

interface SolutionsProps {
  locale: string;
}

export default function Solutions({ locale }: SolutionsProps) {
  const t = useTranslations('solutions');
  const items = t.raw('items') as Array<{ slug: string; title: string; description: string }>;

  return (
    <section className="py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted text-lg">{t('subtitle')}</p>
        </motion.div>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {items.map((item, i) => (
            <motion.div
              key={item.slug}
              className="flex-shrink-0 w-[320px] glass-card overflow-hidden snap-start"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <BeforeAfterSlider
                beforeSrc={`https://placehold.co/640x400/141414/666666?text=Antes`}
                afterSrc={`https://placehold.co/640x400/141414/7C3AED?text=Depois`}
                height="h-[200px]"
              />
              <div className="p-5">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-muted text-sm mb-3 leading-relaxed">{item.description}</p>
                <Link
                  href={`/${locale}/servicos/${item.slug}`}
                  className="text-accent-violet text-sm font-medium hover:text-accent-blue transition-colors"
                >
                  {t('learnMore')}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
