'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Cpu,
  Download,
  Sparkles,
  ShieldCheck,
  Zap,
  Award,
  Maximize2,
  ArrowRight,
  Star,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { getServiceBySlug } from '@/lib/services-data';
import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider';

type AccentKey = 'violet' | 'blue' | 'emerald' | 'rose' | 'amber' | 'fuchsia' | 'cyan';

const accentStyles: Record<
  AccentKey,
  {
    text: string;
    bg: string;
    border: string;
    gradient: string;
    shadow: string;
    glow: string;
  }
> = {
  violet: {
    text: 'text-accent-violet',
    bg: 'bg-accent-violet/15',
    border: 'border-accent-violet/40',
    gradient: 'from-accent-violet to-accent-fuchsia',
    shadow: 'shadow-accent-violet/30',
    glow: 'bg-accent-violet/30',
  },
  blue: {
    text: 'text-accent-blue',
    bg: 'bg-accent-blue/15',
    border: 'border-accent-blue/40',
    gradient: 'from-accent-blue to-accent-cyan',
    shadow: 'shadow-accent-blue/30',
    glow: 'bg-accent-blue/30',
  },
  emerald: {
    text: 'text-accent-emerald',
    bg: 'bg-accent-emerald/15',
    border: 'border-accent-emerald/40',
    gradient: 'from-accent-emerald to-teal-400',
    shadow: 'shadow-accent-emerald/30',
    glow: 'bg-accent-emerald/30',
  },
  rose: {
    text: 'text-accent-rose',
    bg: 'bg-accent-rose/15',
    border: 'border-accent-rose/40',
    gradient: 'from-accent-rose to-pink-500',
    shadow: 'shadow-accent-rose/30',
    glow: 'bg-accent-rose/30',
  },
  amber: {
    text: 'text-amber-400',
    bg: 'bg-amber-400/15',
    border: 'border-amber-400/40',
    gradient: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-400/30',
    glow: 'bg-amber-400/30',
  },
  fuchsia: {
    text: 'text-accent-fuchsia',
    bg: 'bg-accent-fuchsia/15',
    border: 'border-accent-fuchsia/40',
    gradient: 'from-accent-fuchsia to-accent-violet',
    shadow: 'shadow-accent-fuchsia/30',
    glow: 'bg-accent-fuchsia/30',
  },
  cyan: {
    text: 'text-accent-cyan',
    bg: 'bg-accent-cyan/15',
    border: 'border-accent-cyan/40',
    gradient: 'from-accent-cyan to-accent-blue',
    shadow: 'shadow-accent-cyan/30',
    glow: 'bg-accent-cyan/30',
  },
};

export default function ServicePage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = params.locale as string;
  const t = useTranslations('services');
  const ts = useTranslations('servicePage');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const service = getServiceBySlug(slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-muted text-lg">Service not found</p>
      </div>
    );
  }

  const accent = accentStyles[service.accent as AccentKey] ?? accentStyles.violet;
  const processarHref = `/${locale}/app/processar?service=${service.flowService}`;

  const benefitsList = [
    { icon: Award, key: 'quality' as const },
    { icon: Zap, key: 'speed' as const },
    { icon: ShieldCheck, key: 'privacy' as const },
    { icon: Maximize2, key: 'resolution' as const },
  ];

  const stepsList = [
    { icon: Upload, key: 'upload' as const },
    { icon: Cpu, key: 'process' as const },
    { icon: Download, key: 'download' as const },
  ];

  const faqItems = [
    { q: 'faq.q1', a: 'faq.a1' },
    { q: 'faq.q2', a: 'faq.a2' },
    { q: 'faq.q3', a: 'faq.a3' },
    { q: 'faq.q4', a: 'faq.a4' },
  ];

  return (
    <div className="pt-20 overflow-hidden">
      {/* ============ HERO ============ */}
      <section className="relative py-20 md:py-28 px-4">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] ${accent.glow} blur-[140px] opacity-60`}
          />
          <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-accent-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-32 w-[400px] h-[400px] bg-accent-fuchsia/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 ${accent.bg} ${accent.border} border rounded-full text-xs font-bold ${accent.text} tracking-wider mb-6 uppercase`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {ts('heroBadge')}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.05]">
              <span className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                {t(service.titleKey)}
              </span>
            </h1>

            <p className="text-muted text-base md:text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              {t(service.descriptionKey)}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
              <Link
                href={processarHref}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${accent.gradient} text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-xl ${accent.shadow}`}
              >
                {ts('heroCta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#examples"
                className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/15 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all"
              >
                {ts('heroCtaSecondary')}
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="font-semibold text-white/90">
                  {ts('trustStars')}
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted/40" />
              <span>{ts('trustCount')}</span>
            </div>
          </motion.div>

          {/* Visual side - Before/After slider preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div
              className={`absolute -inset-4 bg-gradient-to-r ${accent.gradient} opacity-20 blur-3xl rounded-3xl`}
            />
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
              <BeforeAfterSlider
                height="h-[320px] md:h-[480px]"
                beforeLabel={ts('beforeLabel')}
                afterLabel={ts('afterLabel')}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ BENEFITS ============ */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {ts('benefitsTitle')}
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              {ts('benefitsSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {benefitsList.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${accent.bg} ${accent.border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${accent.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {ts(`benefits.${b.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {ts(`benefits.${b.key}.desc`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] ${accent.glow} blur-[140px] opacity-30`}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {ts('howItWorksTitle')}
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              {ts('howItWorksSubtitle')}
            </p>
          </motion.div>

          <div className="relative grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Connecting line (desktop) */}
            <div
              className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px pointer-events-none"
              aria-hidden
            >
              <div
                className={`h-full bg-gradient-to-r from-transparent via-white/20 to-transparent`}
              />
            </div>

            {stepsList.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative text-center"
                >
                  <div
                    className={`relative w-20 h-20 mx-auto mb-5 rounded-2xl ${accent.bg} ${accent.border} border flex items-center justify-center`}
                  >
                    <Icon className={`w-9 h-9 ${accent.text}`} />
                    <div
                      className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-r ${accent.gradient} flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {ts(`stepsNew.${step.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted max-w-xs mx-auto">
                    {ts(`stepsNew.${step.key}.desc`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ EXAMPLES ============ */}
      <section id="examples" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {ts('examplesTitle')}
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              {ts('examplesSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative group cursor-pointer"
              >
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${accent.gradient} opacity-0 group-hover:opacity-60 blur rounded-2xl transition-opacity`}
                />
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02]">
                  {/* Placeholder visual */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-20`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles
                      className={`w-12 h-12 ${accent.text} opacity-40 group-hover:scale-110 group-hover:opacity-70 transition-all`}
                    />
                  </div>
                  {/* Before/after mini labels */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/70 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {ts('beforeLabel')}
                    </span>
                    <span
                      className={`text-[10px] font-bold text-white ${accent.bg} backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wider`}
                    >
                      {ts('afterLabel')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-20 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {ts('faqTitle')}
            </h2>
            <p className="text-muted">{ts('faqSubtitle')}</p>
          </motion.div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-base font-semibold text-white pr-4">
                    {ts(item.q)}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 ${accent.text} flex-shrink-0 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-muted leading-relaxed">
                        {ts(item.a)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-20 md:py-28 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] ${accent.glow} blur-[140px] opacity-40`}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
              {ts('ctaTitle')}
            </span>
          </h2>
          <p className="text-muted text-base md:text-lg mb-8 max-w-xl mx-auto">
            {ts('ctaSubtitle')}
          </p>
          <Link
            href={processarHref}
            className={`inline-flex items-center gap-2 bg-gradient-to-r ${accent.gradient} text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-all shadow-2xl ${accent.shadow} text-base`}
          >
            {ts('ctaButton')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
