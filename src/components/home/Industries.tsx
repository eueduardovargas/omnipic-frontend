'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Camera, Video, Clock, UserPlus, Eraser, Wand2 } from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Camera,
  Video,
  Clock,
  UserPlus,
  Eraser,
  Wand2,
};

// Each card gets its own accent color palette — social-media vibe
const accentStyles = [
  {
    grad: 'from-violet-500/30 via-fuchsia-500/20 to-transparent',
    ring: 'group-hover:ring-violet-400/50',
    tag: 'bg-violet-500/20 text-violet-200 border-violet-400/30',
    icon: 'text-violet-300',
    glow: 'group-hover:shadow-violet-500/30',
  },
  {
    grad: 'from-rose-500/30 via-pink-500/20 to-transparent',
    ring: 'group-hover:ring-rose-400/50',
    tag: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
    icon: 'text-rose-300',
    glow: 'group-hover:shadow-rose-500/30',
  },
  {
    grad: 'from-emerald-500/30 via-teal-500/20 to-transparent',
    ring: 'group-hover:ring-emerald-400/50',
    tag: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
    icon: 'text-emerald-300',
    glow: 'group-hover:shadow-emerald-500/30',
  },
  {
    grad: 'from-blue-500/30 via-cyan-500/20 to-transparent',
    ring: 'group-hover:ring-blue-400/50',
    tag: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
    icon: 'text-blue-300',
    glow: 'group-hover:shadow-blue-500/30',
  },
  {
    grad: 'from-amber-500/30 via-orange-500/20 to-transparent',
    ring: 'group-hover:ring-amber-400/50',
    tag: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    icon: 'text-amber-300',
    glow: 'group-hover:shadow-amber-500/30',
  },
  {
    grad: 'from-fuchsia-500/30 via-purple-500/20 to-transparent',
    ring: 'group-hover:ring-fuchsia-400/50',
    tag: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/30',
    icon: 'text-fuchsia-300',
    glow: 'group-hover:shadow-fuchsia-500/30',
  },
];

export default function Industries() {
  const t = useTranslations('industries');
  const items = t.raw('items') as Array<{
    icon: string;
    title: string;
    description: string;
    tag?: string;
  }>;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const getIcon = (name: string) => {
    const Icon = iconMap[name];
    return Icon ? <Icon className="w-7 h-7" /> : null;
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent-violet/10 blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-rose/10 blur-[120px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-rose-200 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((item, i) => {
            const accent = accentStyles[i % accentStyles.length];
            const isHovered = hoveredIdx === i;
            return (
              <motion.div
                key={i}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-7 ring-1 ring-transparent transition-all duration-300 hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-2xl ${accent.ring} ${accent.glow}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 100 }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Animated gradient background */}
                <div
                  aria-hidden
                  className={`absolute inset-0 bg-gradient-to-br ${accent.grad} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                {/* Floating orb accent */}
                <motion.div
                  aria-hidden
                  className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${accent.grad} blur-2xl pointer-events-none`}
                  animate={{
                    scale: isHovered ? 1.2 : 1,
                    opacity: isHovered ? 0.8 : 0.4,
                  }}
                  transition={{ duration: 0.5 }}
                />

                <div className="relative z-10">
                  {/* Icon + tag row */}
                  <div className="flex items-start justify-between mb-5">
                    <motion.div
                      className={`w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center ${accent.icon} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      {getIcon(item.icon)}
                    </motion.div>
                    {item.tag && (
                      <span
                        className={`text-[11px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full border backdrop-blur-sm ${accent.tag}`}
                      >
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-white leading-tight">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted text-sm md:text-[15px] leading-relaxed">
                    {item.description}
                  </p>

                  {/* Engagement-style footer — social media feel */}
                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-3 text-xs text-muted/70">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      AI ready
                    </span>
                    <span className="ml-auto text-white/40 group-hover:text-white transition-colors">
                      →
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
