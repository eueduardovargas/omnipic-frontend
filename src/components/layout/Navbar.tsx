'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, Focus, AudioLines, Clock, Maximize2, Palette,
  Smile, Mountain, Sparkles, Video, UserPlus, Eraser, Wand2,
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import OmnipicLogo from './OmnipicLogo';
import UserProfile from '@/components/shared/UserProfile';
import { services } from '@/lib/services-data';
import { usePlansModal } from '@/components/shared/PlansModalContext';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Focus, AudioLines, Clock, Maximize2, Palette, Smile, Mountain,
  Sparkles, Video, UserPlus, Eraser, Wand2,
};

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('navbar');
  const ts = useTranslations('services');
  const { status: authStatus } = useSession();
  const isAuthenticated = authStatus === 'authenticated';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { openPlans } = usePlansModal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getIcon = (name: string) => {
    const Icon = iconMap[name];
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  const handlePlansClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    openPlans();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 group">
              <OmnipicLogo className="w-9 h-9 group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold tracking-tight">
                Omni<span className="bg-gradient-to-r from-accent-violet to-accent-blue bg-clip-text text-transparent">Pic</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm text-muted hover:text-white transition-colors">
                  {t('enhance')} <ChevronDown className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2"
                    >
                      <div className="bg-card border border-border rounded-card shadow-2xl p-4 grid grid-cols-2 gap-1 w-[480px]">
                        {services.map((service) => (
                          <Link
                            key={service.slug}
                            href={`/${locale}/servicos/${service.slug}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            {getIcon(service.icon)}
                            <span className="text-sm">{ts(service.titleKey)}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href={`/${locale}/memorias-vivas`}
                className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors"
              >
                {t('livingMemories')}
                <span className="bg-accent-rose text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium animate-pulse">
                  {t('new')}
                </span>
              </Link>
              <button
                onClick={handlePlansClick}
                className="text-sm text-muted hover:text-white transition-colors"
              >
                {t('plans')}
              </button>
              <Link
                href={`/${locale}/suporte`}
                className="text-sm text-muted hover:text-white transition-colors"
              >
                {t('support')}
              </Link>
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher locale={locale} />
              {isAuthenticated ? (
                <UserProfile locale={locale} />
              ) : (
                <>
                  <Link
                    href={`/${locale}/auth`}
                    className="text-sm text-muted hover:text-white transition-colors px-4 py-2"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href={`/${locale}/auth`}
                    className="text-sm bg-gradient-accent text-white font-medium px-5 py-2 rounded-btn hover:opacity-90 transition-opacity"
                  >
                    {t('startFree')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button className="lg:hidden p-2" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-background border-l border-border z-50 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <OmnipicLogo className="w-8 h-8" />
                  <span className="text-lg font-bold">OmniPic</span>
                </div>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs text-muted uppercase tracking-wider mb-2">{t('enhance')}</p>
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/${locale}/servicos/${service.slug}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {getIcon(service.icon)}
                    <span className="text-sm">{ts(service.titleKey)}</span>
                  </Link>
                ))}
                <div className="border-t border-border my-4" />
                <Link
                  href={`/${locale}/memorias-vivas`}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('livingMemories')}{' '}
                  <span className="bg-accent-rose text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {t('new')}
                  </span>
                </Link>
                <button
                  onClick={handlePlansClick}
                  className="block w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm"
                >
                  {t('plans')}
                </button>
                <Link
                  href={`/${locale}/suporte`}
                  className="block px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('support')}
                </Link>
                <div className="border-t border-border my-4" />
                <LanguageSwitcher locale={locale} />
                <div className="space-y-2 mt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href={`/${locale}/dashboard`}
                        className="block w-full text-center bg-gradient-accent text-white font-medium px-4 py-2.5 rounded-btn text-sm"
                        onClick={() => setMobileOpen(false)}
                      >
                        Painel
                      </Link>
                      <div className="pt-2">
                        <UserProfile locale={locale} align="start" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/${locale}/auth`}
                        className="block w-full text-center border border-border px-4 py-2.5 rounded-btn text-sm"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t('login')}
                      </Link>
                      <Link
                        href={`/${locale}/auth`}
                        className="block w-full text-center bg-gradient-accent text-white font-medium px-4 py-2.5 rounded-btn text-sm"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t('startFree')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
