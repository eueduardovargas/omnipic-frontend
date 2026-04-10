'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Home,
  FolderOpen,
  Heart,
  CreditCard,
  Settings,
  Plus,
  Sparkles,
  Clock,
  UserPlus,
  Eraser,
  Wand2,
  Play,
  Zap,
  Shield,
  ImageIcon,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const sidebarLinks = [
  { icon: Home, labelKey: 'home' },
  { icon: FolderOpen, labelKey: 'myProjects' },
  { icon: Heart, labelKey: 'livingMemories' },
  { icon: CreditCard, labelKey: 'currentPlan' },
  { icon: Settings, labelKey: 'settings' },
] as const;

const serviceCards = [
  { icon: Play, labelKey: 'bringToLife', color: 'from-accent-violet to-accent-blue' },
  { icon: Clock, labelKey: 'restoreOld', color: 'from-amber-500 to-orange-500' },
  { icon: UserPlus, labelKey: 'addPeople', color: 'from-accent-emerald to-teal-500' },
  { icon: Eraser, labelKey: 'removeObjects', color: 'from-accent-blue to-cyan-500' },
  { icon: Wand2, labelKey: 'filtersEffects', color: 'from-fuchsia-500 to-accent-violet' },
  { icon: Heart, labelKey: 'livingMemories', color: 'from-accent-rose to-pink-500' },
] as const;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const ts = useTranslations('smartflow');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r border-border bg-surface/50 backdrop-blur-xl p-6 gap-6 sticky top-0 h-screen">
        {/* Avatar and user */}
        <div className="flex items-center gap-3 mb-2 mt-16">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-violet to-accent-fuchsia flex items-center justify-center text-white font-bold text-sm">
            U
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Usu&aacute;rio</p>
            <p className="text-muted text-xs">Pro</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map(({ icon: Icon, labelKey }) => (
            <button
              key={labelKey}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <Icon className="w-4 h-4" />
              {t(labelKey)}
            </button>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* New Project button */}
        <Link
          href={`/${locale}/app/processar`}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-accent-violet to-accent-fuchsia text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-accent-violet/25"
        >
          <Plus className="w-4 h-4" />
          {t('newProject')}
        </Link>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 pt-24 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* HERO SECTION */}
          <motion.section
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent-violet/15 via-background to-accent-blue/15 p-8 md:p-12"
            {...fadeIn}
          >
            {/* Background blur orbs */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent-violet/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent-blue/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              {/* Left: Copy */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-accent-violet/30 rounded-full text-xs text-accent-violet mb-4 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('heroBadge')}</span>
                </motion.div>

                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                  {t('welcome')}, <br className="hidden md:block" />
                  <span className="bg-gradient-to-r from-accent-violet via-accent-fuchsia to-accent-blue bg-clip-text text-transparent">
                    Usu&aacute;rio
                  </span>
                </h1>

                <p className="text-muted text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                  {t('heroSubtitle')}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/${locale}/app/processar`}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent-violet to-accent-blue text-white font-semibold px-7 py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-accent-violet/30 hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    {t('heroCta')}
                  </Link>
                  <a
                    href="#services"
                    className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-semibold px-7 py-4 rounded-2xl hover:bg-white/10 transition-all"
                  >
                    {t('heroSecondary')}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Trust signals */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <div className="w-7 h-7 rounded-full bg-accent-violet/20 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-accent-violet" />
                    </div>
                    <span>{t('trustFast')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <div className="w-7 h-7 rounded-full bg-accent-emerald/20 flex items-center justify-center">
                      <Shield className="w-3.5 h-3.5 text-accent-emerald" />
                    </div>
                    <span>{t('trustSecure')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <div className="w-7 h-7 rounded-full bg-accent-blue/20 flex items-center justify-center">
                      <ImageIcon className="w-3.5 h-3.5 text-accent-blue" />
                    </div>
                    <span>{t('trustQuality')}</span>
                  </div>
                </div>
              </div>

              {/* Right: Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block relative"
              >
                <div className="relative aspect-square max-w-md mx-auto">
                  {/* Floating cards */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-0 right-0 w-44 h-44 rounded-3xl bg-gradient-to-br from-accent-violet to-accent-fuchsia p-1 shadow-2xl shadow-accent-violet/40"
                  >
                    <div className="w-full h-full rounded-3xl bg-background/60 backdrop-blur flex flex-col items-center justify-center gap-2">
                      <Sparkles className="w-12 h-12 text-white" />
                      <span className="text-xs text-white/80 font-semibold">AI Magic</span>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-0 left-0 w-52 h-52 rounded-3xl bg-gradient-to-br from-accent-blue to-cyan-400 p-1 shadow-2xl shadow-accent-blue/40"
                  >
                    <div className="w-full h-full rounded-3xl bg-background/60 backdrop-blur flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="w-14 h-14 text-white" />
                      <span className="text-xs text-white/80 font-semibold">4K Quality</span>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute top-1/4 left-1/4 w-32 h-32 rounded-2xl bg-gradient-to-br from-accent-rose to-orange-500 p-1 shadow-2xl shadow-accent-rose/40"
                  >
                    <div className="w-full h-full rounded-2xl bg-background/60 backdrop-blur flex items-center justify-center">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Service carousel */}
          <SmartFlowCarousel locale={locale} ts={ts} serviceCards={serviceCards} />

          {/* Recent projects - empty state */}
          <motion.div
            className="glass-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-white mb-6">{t('recentProjects')}</h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="w-16 h-16 text-muted/30 mb-4" />
              <p className="text-muted text-sm max-w-sm">{t('noProjects')}</p>
              <Link
                href={`/${locale}/app/processar`}
                className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-violet to-accent-fuchsia text-white font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                {t('newProject')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Mobile bottom bar for New Project */}
        <div className="md:hidden fixed bottom-6 left-0 right-0 flex justify-center z-50">
          <Link
            href={`/${locale}/app/processar`}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent-violet to-accent-fuchsia text-white font-semibold text-sm shadow-lg shadow-accent-violet/25 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            {t('newProject')}
          </Link>
        </div>
      </main>
    </div>
  );
}

/* ============ SmartFlow Carousel ============ */
interface SmartFlowCarouselProps {
  locale: string;
  ts: (key: string) => string;
  serviceCards: readonly {
    icon: React.ComponentType<{ className?: string }>;
    labelKey: string;
    color: string;
  }[];
}

function SmartFlowCarousel({ locale, ts, serviceCards }: SmartFlowCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('a')?.offsetWidth ?? 180;
    el.scrollBy({ left: dir === 'left' ? -cardWidth * 2 : cardWidth * 2, behavior: 'smooth' });
  };

  return (
    <motion.div
      id="services"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="scroll-mt-24"
    >
      {/* Header with arrows */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">SmartFlow</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Pr&oacute;ximo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable container */}
      <div className="relative">
        {/* Left fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {serviceCards.map(({ icon: Icon, labelKey, color }) => (
            <Link
              key={labelKey}
              href={`/${locale}/app/processar`}
              className="glass-card p-4 flex flex-col items-center gap-3 text-center hover:border-accent-violet/50 hover:bg-white/5 transition-all group snap-start shrink-0 w-[140px] sm:w-[160px]"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-muted group-hover:text-white transition-colors leading-tight">
                {ts(labelKey)}
              </span>
            </Link>
          ))}
        </div>

        {/* Right fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
}
