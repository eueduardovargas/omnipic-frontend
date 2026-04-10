'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Upload,
  Cpu,
  Download,
  Star,
  Zap,
  Shield,
  Infinity as InfinityIcon,
  ArrowRight,
  Camera,
} from 'lucide-react';
import Link from 'next/link';
import FAQ from '@/components/shared/FAQ';

type ColorKey = 'blue' | 'fuchsia' | 'violet' | 'amber' | 'emerald' | 'rose';

const colorStyles: Record<
  ColorKey,
  { gradient: string; bg: string; border: string; text: string; dot: string }
> = {
  blue: {
    gradient: 'from-blue-500/30 to-cyan-500/10',
    bg: 'bg-blue-500/10',
    border: 'border-blue-400/30',
    text: 'text-blue-200',
    dot: 'bg-blue-400',
  },
  fuchsia: {
    gradient: 'from-fuchsia-500/30 to-pink-500/10',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-400/30',
    text: 'text-fuchsia-200',
    dot: 'bg-fuchsia-400',
  },
  violet: {
    gradient: 'from-violet-500/30 to-purple-500/10',
    bg: 'bg-violet-500/10',
    border: 'border-violet-400/30',
    text: 'text-violet-200',
    dot: 'bg-violet-400',
  },
  amber: {
    gradient: 'from-amber-500/30 to-orange-500/10',
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/30',
    text: 'text-amber-200',
    dot: 'bg-amber-400',
  },
  emerald: {
    gradient: 'from-emerald-500/30 to-teal-500/10',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400/30',
    text: 'text-emerald-200',
    dot: 'bg-emerald-400',
  },
  rose: {
    gradient: 'from-rose-500/30 to-pink-500/10',
    bg: 'bg-rose-500/10',
    border: 'border-rose-400/30',
    text: 'text-rose-200',
    dot: 'bg-rose-400',
  },
};

const featureIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Shield,
  Sparkles,
  Infinity: InfinityIcon,
};

export default function MemoriasVivasPage() {
  const t = useTranslations('memoriasVivas');
  const params = useParams();
  const locale = params.locale as string;

  const heroStats = t.raw('heroStats') as Array<{ value: string; label: string }>;
  const styles = t.raw('styles') as Array<{
    name: string;
    description: string;
    color: ColorKey;
  }>;
  const steps = t.raw('steps') as Array<{ title: string; description: string }>;
  const features = t.raw('features') as Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  const testimonials = t.raw('testimonials') as Array<{
    name: string;
    handle?: string;
    text: string;
    accent?: ColorKey;
  }>;
  const faq = t.raw('faq') as Array<{ question: string; answer: string }>;
  const stepIcons = [Upload, Cpu, Download];

  // Link to processar with the "reconstrucao" flow pre-selected (memorias-vivas maps to it)
  const processarHref = `/${locale}/app/processar?service=reconstrucao`;

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div
            aria-hidden
            className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-500/20 blur-[120px] animate-pulse"
          />
          <div
            aria-hidden
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-fuchsia-500/20 blur-[120px]"
            style={{ animationDelay: '1s' }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]"
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 text-sm text-white/90"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Sparkles className="w-4 h-4 text-accent-violet" />
              <span>{t('badge')}</span>
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]">
              <span className="bg-gradient-to-br from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                {t('pageTitle')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/70 text-base md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
              {t('pageSubtitle')}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href={processarHref}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-semibold px-8 py-4 rounded-btn text-lg transition-all hover:shadow-2xl hover:shadow-violet-500/40 hover:scale-[1.02]"
              >
                <Camera className="w-5 h-5" />
                {t('cta')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#exemplos"
                className="inline-flex items-center gap-2 glass-card px-8 py-4 rounded-btn text-white/90 hover:bg-white/10 transition-colors font-medium"
              >
                {t('ctaSecondary')}
              </a>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {heroStats.map((stat, i) => (
                <div
                  key={i}
                  className="glass-card p-4 md:p-6 text-center rounded-2xl"
                >
                  <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-white/60 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* EXAMPLES / STYLES GRID */}
      <section id="exemplos" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
              {t('examplesTitle')}
            </h2>
            <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
              {t('examplesSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {styles.map((style, i) => {
              const c = colorStyles[style.color];
              return (
                <motion.div
                  key={i}
                  className={`group relative aspect-[3/4] rounded-3xl overflow-hidden border ${c.border} bg-white/5 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  {/* Background gradient placeholder (for future real images) */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />

                  {/* Decorative avatar silhouette */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
                    <Camera className="w-20 h-20 text-white/60" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse`} />
                      <span className={`text-[10px] uppercase tracking-wider font-bold ${c.text}`}>
                        AI style
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-lg md:text-xl mb-1">
                      {style.name}
                    </h3>
                    <p className="text-white/70 text-xs md:text-sm">
                      {style.description}
                    </p>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 relative">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('howItWorks')}
          </motion.h2>

          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div
              aria-hidden
              className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-violet-500/50"
            />

            <div className="grid md:grid-cols-3 gap-8 relative">
              {steps.map((step, i) => {
                const Icon = stepIcons[i];
                return (
                  <motion.div
                    key={i}
                    className="text-center relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <div className="relative inline-block mb-6">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-400/30 backdrop-blur-xl flex items-center justify-center mx-auto relative z-10">
                        <Icon className="w-10 h-10 text-violet-200" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-3xl blur-xl" />
                    </div>
                    <div className="inline-block bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      STEP {i + 1}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {step.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('featuresTitle')}
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => {
              const Icon = featureIconMap[feature.icon] ?? Sparkles;
              return (
                <motion.div
                  key={i}
                  className="glass-card p-6 rounded-3xl hover:bg-white/[0.08] transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-400/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-violet-200" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('testimonialsTitle')}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((item, i) => {
              const c = colorStyles[item.accent ?? 'violet'];
              return (
                <motion.div
                  key={i}
                  className={`glass-card p-6 rounded-3xl border ${c.border} hover:bg-white/[0.08] transition-all`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-white/90 text-base leading-relaxed mb-5">
                    &ldquo;{item.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.gradient} border ${c.border} flex items-center justify-center text-sm font-bold text-white`}
                    >
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">
                        {item.name}
                      </p>
                      {item.handle && (
                        <p className="text-xs text-white/50">{item.handle}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <FAQ items={faq} />
      </section>

      {/* DISCLAIMER */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-6 text-center rounded-2xl">
            <p className="text-muted text-sm leading-relaxed">
              {t('disclaimer')}
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_70%)]"
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <Sparkles className="w-12 h-12 text-accent-violet mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <Link
            href={processarHref}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-semibold px-10 py-4 rounded-btn text-lg transition-all hover:shadow-2xl hover:shadow-violet-500/40 hover:scale-[1.02]"
          >
            <Camera className="w-5 h-5" />
            {t('cta')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
