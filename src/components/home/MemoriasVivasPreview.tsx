'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface MemoriasVivasPreviewProps {
  locale: string;
}

export default function MemoriasVivasPreview({ locale }: MemoriasVivasPreviewProps) {
  const t = useTranslations('memoriasVivas');

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="relative rounded-card overflow-hidden p-8 md:p-12 rose-gradient-border gradient-border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Background particles (CSS) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.06),transparent_70%)]" />
          <div className="absolute top-10 left-10 w-1 h-1 bg-accent-rose/40 rounded-full animate-pulse" />
          <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-accent-violet/40 rounded-full animate-pulse delay-500" />
          <div className="absolute bottom-10 left-1/3 w-1 h-1 bg-accent-rose/30 rounded-full animate-pulse delay-1000" />

          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-accent-rose" />
                <Sparkles className="w-5 h-5 text-accent-rose/60" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
              <p className="text-muted leading-relaxed mb-8">{t('description')}</p>
              <Link
                href={`/${locale}/memorias-vivas`}
                className="inline-block bg-gradient-rose text-white font-semibold px-8 py-3.5 rounded-btn hover:opacity-90 transition-opacity"
              >
                {t('cta')}
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-sm aspect-[3/4] rounded-card bg-white/5 border border-white/10 flex items-center justify-center">
                <Heart className="w-16 h-16 text-accent-rose/30" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
