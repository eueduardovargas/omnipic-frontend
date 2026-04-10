'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  Crown,
  Star,
  Flame,
  Loader2,
} from 'lucide-react';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

type PlanKey = 'weekly' | 'monthly' | 'annual';

export default function PlansModal({ isOpen, onClose, locale }: PlansModalProps) {
  const t = useTranslations('plansModal');
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('annual');
  const { startCheckout, loading: checkoutLoading, error: checkoutError } =
    useStripeCheckout(locale);
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  const safeRaw = <T,>(key: string, fallback: T): T => {
    try {
      return t.raw(key) as T;
    } catch {
      return fallback;
    }
  };

  const weeklyFeatures = safeRaw<string[]>('plans.weekly.features', []);
  const monthlyFeatures = safeRaw<string[]>('plans.monthly.features', []);
  const annualFeatures = safeRaw<string[]>('plans.annual.features', []);

  // Dynamic discount calculation from raw prices
  const weeklyRaw = safeRaw<number>('plans.weekly.rawPrice', 0);
  const monthlyRaw = safeRaw<number>('plans.monthly.rawPrice', 0);
  const annualRaw = safeRaw<number>('plans.annual.rawPrice', 0);

  const monthlyDiscount =
    weeklyRaw > 0 && monthlyRaw > 0
      ? `${Math.round((1 - monthlyRaw / (weeklyRaw * 4.286)) * 100)}% OFF`
      : safeRaw<string>('plans.monthly.discountBadge', '');
  const annualDiscount =
    weeklyRaw > 0 && annualRaw > 0
      ? `${Math.round((1 - annualRaw / (weeklyRaw * 52.14)) * 100)}% OFF`
      : safeRaw<string>('plans.annual.discountBadge', '');

  const handleCheckout = async (planType: PlanKey) => {
    setLoadingPlan(planType);
    await startCheckout(planType);
    setLoadingPlan(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="plans-modal-title"
          >
            <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-gradient-to-br from-[#0a0a0a] to-[#141414] border border-white/10 rounded-3xl shadow-2xl pointer-events-auto">
              {/* Ambient glow */}
              <div
                aria-hidden
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-violet/20 blur-[120px] pointer-events-none"
              />

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label={t('close')}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center pt-12 pb-6 px-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-accent-rose/20 to-accent-violet/20 border border-accent-violet/40 rounded-full text-xs font-bold text-accent-violet tracking-wider mb-4"
                >
                  <Clock className="w-3.5 h-3.5" />
                  {t('limitedTime')}
                </motion.div>
                <h2
                  id="plans-modal-title"
                  className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent"
                >
                  {t('title')}
                </h2>
                <p className="text-muted text-sm md:text-base max-w-xl mx-auto">
                  {t('subtitle')}
                </p>
              </div>

              {/* Plans Grid - 3 tiers */}
              <div className="grid md:grid-cols-3 gap-4 md:gap-5 px-6 pb-6 relative z-10">
                {/* WEEKLY */}
                <PlanCard
                  planKey="weekly"
                  name={t('plans.weekly.name')}
                  tagline={t('plans.weekly.tagline')}
                  price={t('plans.weekly.price')}
                  period={t('plans.weekly.period')}
                  billedAs={t('plans.weekly.billedAs')}
                  features={weeklyFeatures}
                  ctaLabel={t('selectPlan')}
                  isSelected={selectedPlan === 'weekly'}
                  isFeatured={false}
                  isLoading={loadingPlan === 'weekly' && checkoutLoading}
                  onSelect={() => setSelectedPlan('weekly')}
                  onCheckout={() => handleCheckout('weekly')}
                  variant="default"
                  delay={0.15}
                />

                {/* MONTHLY */}
                <PlanCard
                  planKey="monthly"
                  name={t('plans.monthly.name')}
                  tagline={t('plans.monthly.tagline')}
                  price={t('plans.monthly.price')}
                  period={t('plans.monthly.period')}
                  billedAs={t('plans.monthly.billedAs')}
                  features={monthlyFeatures}
                  ctaLabel={t('selectPlan')}
                  discountBadge={monthlyDiscount}
                  discountTone="emerald"
                  isSelected={selectedPlan === 'monthly'}
                  isFeatured={false}
                  isLoading={loadingPlan === 'monthly' && checkoutLoading}
                  onSelect={() => setSelectedPlan('monthly')}
                  onCheckout={() => handleCheckout('monthly')}
                  variant="default"
                  delay={0.2}
                />

                {/* ANNUAL - BEST VALUE */}
                <PlanCard
                  planKey="annual"
                  name={t('plans.annual.name')}
                  tagline={t('plans.annual.tagline')}
                  price={t('plans.annual.price')}
                  period={t('plans.annual.period')}
                  billedAs={t('plans.annual.billedAs')}
                  monthlyEquivalent={t('plans.annual.monthlyEquivalent')}
                  savingsLabel={t('plans.annual.savingsLabel')}
                  badge={t('plans.annual.badge')}
                  features={annualFeatures}
                  ctaLabel={t('letsGo')}
                  discountBadge={annualDiscount}
                  discountTone="rose"
                  isSelected={selectedPlan === 'annual'}
                  isFeatured
                  isLoading={loadingPlan === 'annual' && checkoutLoading}
                  onSelect={() => setSelectedPlan('annual')}
                  onCheckout={() => handleCheckout('annual')}
                  variant="featured"
                  delay={0.25}
                />
              </div>

              {checkoutError && (
                <div className="mx-6 mb-4 px-4 py-3 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-sm text-center relative z-10">
                  {checkoutError}
                </div>
              )}

              {/* Footer trust signals */}
              <div className="border-t border-white/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted relative z-10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-emerald" />
                  <span>{t('secureCheckout')}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-muted/40" />
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent-emerald" />
                  <span>{t('cancelAnytime')}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-muted/40" />
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-violet" />
                  <span>{t('moneyBack')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface PlanCardProps {
  planKey: PlanKey;
  name: string;
  tagline: string;
  price: string;
  period: string;
  billedAs: string;
  monthlyEquivalent?: string;
  savingsLabel?: string;
  badge?: string;
  discountBadge?: string;
  discountTone?: 'emerald' | 'rose';
  features: string[];
  ctaLabel: string;
  isSelected: boolean;
  isFeatured: boolean;
  isLoading?: boolean;
  onSelect: () => void;
  onCheckout: () => void;
  variant: 'default' | 'featured';
  delay: number;
}

function PlanCard({
  name,
  tagline,
  price,
  period,
  billedAs,
  monthlyEquivalent,
  savingsLabel,
  badge,
  discountBadge,
  discountTone = 'emerald',
  features,
  ctaLabel,
  isSelected,
  isFeatured,
  isLoading = false,
  onSelect,
  onCheckout,
  variant,
  delay,
}: PlanCardProps) {
  const discountToneClasses =
    discountTone === 'rose'
      ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-rose-500/40'
      : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/40';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative rounded-2xl p-5 md:p-6 cursor-pointer transition-all duration-300 ${
        variant === 'featured'
          ? 'bg-gradient-to-b from-accent-violet/[0.18] to-accent-fuchsia/[0.08] border-2 border-accent-violet/60 shadow-2xl shadow-accent-violet/30 md:scale-[1.03]'
          : `bg-gradient-to-b from-white/[0.05] to-white/[0.02] border ${
              isSelected
                ? 'border-accent-violet/60 shadow-lg shadow-accent-violet/20'
                : 'border-white/10 hover:border-white/20'
            }`
      }`}
      onClick={onSelect}
    >
      {/* Featured badge */}
      {isFeatured && badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-violet to-accent-fuchsia blur-md opacity-80" />
            <div className="relative bg-gradient-to-r from-accent-violet to-accent-fuchsia text-white text-[11px] font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg flex items-center gap-1">
              <Crown className="w-3 h-3" />
              {badge}
            </div>
          </div>
        </div>
      )}

      {/* Discount badge (top-left) */}
      {discountBadge && (
        <div className="absolute -top-2.5 -left-2.5 z-10">
          <div className="relative">
            <div
              className={`absolute inset-0 blur-md opacity-60 rounded-full ${discountToneClasses}`}
            />
            <div
              className={`relative text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 ring-1 ring-white/20 ${discountToneClasses}`}
            >
              <Flame className="w-3 h-3" />
              {discountBadge}
            </div>
          </div>
        </div>
      )}

      {/* Selection indicator */}
      <div className="absolute top-4 right-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-accent-violet border-accent-violet'
              : 'border-white/30 bg-transparent'
          }`}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>

      {/* Plan name + tagline */}
      <div className="mb-5 pr-8 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          {isFeatured && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        </div>
        <p className="text-xs text-muted">{tagline}</p>
      </div>

      {/* Savings banner (annual only) */}
      {savingsLabel && (
        <div className="mb-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-emerald/20 border border-accent-emerald/40">
          <span className="text-[10px] font-bold text-accent-emerald uppercase tracking-wide">
            {savingsLabel}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="mb-5">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span
            className={`text-3xl md:text-4xl font-bold ${
              isFeatured
                ? 'bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent'
                : 'text-white'
            }`}
          >
            {price}
          </span>
          <span className="text-sm text-muted">/{period}</span>
        </div>
        <p className="text-[11px] text-muted/80 mt-1">{billedAs}</p>
        {monthlyEquivalent && (
          <p className="text-[11px] text-accent-emerald font-semibold mt-0.5">
            {monthlyEquivalent}
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs md:text-sm text-white/80"
          >
            <Check
              className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                isFeatured ? 'text-accent-violet' : 'text-accent-emerald'
              }`}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        type="button"
        disabled={isLoading}
        onClick={(e) => {
          e.stopPropagation();
          onCheckout();
        }}
        className={`w-full inline-flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all text-sm disabled:opacity-70 disabled:cursor-wait ${
          isFeatured
            ? 'bg-gradient-to-r from-accent-violet to-accent-fuchsia hover:opacity-90 text-white shadow-lg shadow-accent-violet/40'
            : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
        }`}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {ctaLabel}
      </button>
    </motion.div>
  );
}
