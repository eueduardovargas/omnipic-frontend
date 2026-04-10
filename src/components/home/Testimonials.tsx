'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';
import Counter from '@/components/shared/Counter';

type AccentKey =
  | 'violet'
  | 'rose'
  | 'emerald'
  | 'blue'
  | 'fuchsia'
  | 'cyan';

type Review = {
  name: string;
  handle?: string;
  platform: string;
  rating: number;
  text: string;
  accent?: AccentKey;
  size?: 'large' | 'medium';
};

const accentMap: Record<AccentKey, { bg: string; ring: string; avatar: string; orb: string }> = {
  violet: {
    bg: 'from-violet-500/25 via-purple-500/10 to-transparent',
    ring: 'hover:ring-violet-400/50',
    avatar: 'from-violet-500 to-purple-600',
    orb: 'bg-violet-500/20',
  },
  rose: {
    bg: 'from-rose-500/25 via-pink-500/10 to-transparent',
    ring: 'hover:ring-rose-400/50',
    avatar: 'from-rose-500 to-pink-600',
    orb: 'bg-rose-500/20',
  },
  emerald: {
    bg: 'from-emerald-500/25 via-teal-500/10 to-transparent',
    ring: 'hover:ring-emerald-400/50',
    avatar: 'from-emerald-500 to-teal-600',
    orb: 'bg-emerald-500/20',
  },
  blue: {
    bg: 'from-blue-500/25 via-cyan-500/10 to-transparent',
    ring: 'hover:ring-blue-400/50',
    avatar: 'from-blue-500 to-cyan-600',
    orb: 'bg-blue-500/20',
  },
  fuchsia: {
    bg: 'from-fuchsia-500/25 via-pink-500/10 to-transparent',
    ring: 'hover:ring-fuchsia-400/50',
    avatar: 'from-fuchsia-500 to-pink-600',
    orb: 'bg-fuchsia-500/20',
  },
  cyan: {
    bg: 'from-cyan-500/25 via-blue-500/10 to-transparent',
    ring: 'hover:ring-cyan-400/50',
    avatar: 'from-cyan-500 to-blue-600',
    orb: 'bg-cyan-500/20',
  },
};

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 font-semibold">
      {platform}
    </span>
  );
}

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const counters = t.raw('counters') as Array<{ value: string; label: string }>;
  const reviews = t.raw('reviews') as Review[];
  const badge = t('badge');
  const subtitle = t('subtitle');

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-accent-violet/10 blur-[140px] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full bg-accent-rose/10 blur-[140px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-5 text-sm text-white/80"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4 text-accent-violet" />
            {badge}
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-rose-200 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Counters */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-16">
          {counters.map((counter, i) => (
            <Counter key={i} value={counter.value} label={counter.label} />
          ))}
        </div>

        {/* Bento grid reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
          {reviews.map((review, i) => {
            const accent = accentMap[review.accent ?? 'violet'];
            const isLarge = review.size === 'large';
            return (
              <motion.article
                key={i}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-7 ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08] ${accent.ring} ${
                  isLarge ? 'lg:col-span-1 lg:row-span-1' : ''
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 100 }}
              >
                {/* Gradient orb */}
                <div
                  aria-hidden
                  className={`absolute -top-16 -right-16 w-40 h-40 rounded-full ${accent.orb} blur-3xl opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />

                {/* Bottom gradient veil */}
                <div
                  aria-hidden
                  className={`absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t ${accent.bg} opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />

                <div className="relative z-10 h-full flex flex-col">
                  {/* Quote icon */}
                  <Quote
                    className="w-8 h-8 text-white/20 mb-4 group-hover:text-white/40 transition-colors"
                    aria-hidden
                  />

                  {/* Review text */}
                  <p
                    className={`text-white/90 leading-relaxed mb-6 flex-1 ${
                      isLarge ? 'text-base md:text-lg' : 'text-sm md:text-base'
                    }`}
                  >
                    {review.text}
                  </p>

                  {/* Footer: avatar + name + rating */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-br ${accent.avatar} flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0`}
                    >
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-white truncate">
                          {review.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        {review.handle && (
                          <span className="truncate">{review.handle}</span>
                        )}
                        {review.handle && <span>·</span>}
                        <PlatformBadge platform={review.platform} />
                      </div>
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
