'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Video,
  Clock,
  UserPlus,
  Eraser,
  Wand2,
  ArrowRight,
  Sparkles,
  Play,
} from 'lucide-react';
import { isAuthenticated } from '@/lib/n8n-webhook';
import BeforeAfterSlider from '@/components/shared/BeforeAfterSlider';

interface HomeServicesProps {
  locale: string;
}

interface ServiceConfig {
  key: string;
  slug: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconBg: string;
  beforeSrc: string;
  afterSrc: string;
  borderColor: string;
  isVideo?: boolean;
}

const serviceConfigs: ServiceConfig[] = [
  {
    key: 'memoriasVivas',
    slug: 'memorias-vivas',
    href: '/memorias-vivas',
    icon: Heart,
    gradient: 'from-accent-rose/20 via-pink-500/10 to-accent-violet/20',
    iconBg: 'from-accent-rose to-pink-500',
    beforeSrc: 'https://placehold.co/600x400/1a0e1a/888888?text=Antes',
    afterSrc: 'https://placehold.co/600x400/1a0e1a/F43F5E?text=Depois',
    borderColor: 'group-hover:border-accent-rose/60',
  },
  {
    key: 'bringToLife',
    slug: 'aprimorador-video',
    href: '/servicos/aprimorador-video',
    icon: Video,
    gradient: 'from-accent-violet/20 via-purple-500/10 to-accent-blue/20',
    iconBg: 'from-accent-violet to-accent-blue',
    beforeSrc: 'https://placehold.co/600x400/0e0e1a/7C3AED?text=Foto+%E2%86%92+V%C3%ADdeo',
    afterSrc: 'https://placehold.co/600x400/0e0e1a/7C3AED?text=Foto+%E2%86%92+V%C3%ADdeo',
    borderColor: 'group-hover:border-accent-violet/60',
    isVideo: true,
  },
  {
    key: 'restoreOld',
    slug: 'restaurador-fotos-antigas',
    href: '/servicos/restaurador-fotos-antigas',
    icon: Clock,
    gradient: 'from-amber-500/20 via-orange-500/10 to-accent-rose/20',
    iconBg: 'from-amber-500 to-orange-500',
    beforeSrc: 'https://placehold.co/600x400/1a140e/888888?text=Antes',
    afterSrc: 'https://placehold.co/600x400/1a140e/F59E0B?text=Depois',
    borderColor: 'group-hover:border-amber-500/60',
  },
  {
    key: 'addPeople',
    slug: 'adicionar-pessoas',
    href: '/servicos/adicionar-pessoas',
    icon: UserPlus,
    gradient: 'from-accent-emerald/20 via-teal-500/10 to-accent-blue/20',
    iconBg: 'from-accent-emerald to-teal-500',
    beforeSrc: 'https://placehold.co/600x400/0e1a16/888888?text=Antes',
    afterSrc: 'https://placehold.co/600x400/0e1a16/10B981?text=Depois',
    borderColor: 'group-hover:border-accent-emerald/60',
  },
  {
    key: 'removeObjects',
    slug: 'remover-objetos',
    href: '/servicos/remover-objetos',
    icon: Eraser,
    gradient: 'from-accent-blue/20 via-cyan-500/10 to-accent-violet/20',
    iconBg: 'from-accent-blue to-cyan-500',
    beforeSrc: 'https://placehold.co/600x400/0e141a/888888?text=Antes',
    afterSrc: 'https://placehold.co/600x400/0e141a/2563EB?text=Depois',
    borderColor: 'group-hover:border-accent-blue/60',
  },
  {
    key: 'filtersEffects',
    slug: 'filtros-efeitos',
    href: '/servicos/filtros-efeitos',
    icon: Wand2,
    gradient: 'from-fuchsia-500/20 via-accent-violet/10 to-accent-rose/20',
    iconBg: 'from-fuchsia-500 to-accent-violet',
    beforeSrc: 'https://placehold.co/600x400/1a0e1a/888888?text=Antes',
    afterSrc: 'https://placehold.co/600x400/1a0e1a/D946EF?text=Depois',
    borderColor: 'group-hover:border-fuchsia-500/60',
  },
];

export default function HomeServices({ locale }: HomeServicesProps) {
  const t = useTranslations('homeServices');
  const router = useRouter();

  // "Try Now" click handler — checks auth, redirects to login or to upload flow
  const handleTryNow = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      router.push(`/${locale}/auth?redirect=service&service=${slug}`);
    } else {
      router.push(`/${locale}/app/processar?service=${slug}`);
    }
  };

  return (
    <section className="py-20 md:py-28 px-4 relative overflow-hidden" id="services">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.06),transparent_70%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-muted mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
            <span>AI-Powered</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {t('title')}
          </h2>
          <p className="text-muted text-lg">{t('subtitle')}</p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceConfigs.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative"
              >
                <Link
                  href={`/${locale}${service.href}`}
                  className={`block relative overflow-hidden rounded-3xl border border-white/10 ${service.borderColor} bg-gradient-to-br ${service.gradient} backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent-violet/10 h-full`}
                >
                  {/* Visual preview */}
                  <div className="relative aspect-[5/3] overflow-hidden bg-black/40">
                    {service.isVideo ? (
                      /* Video placeholder — ready for a demo video */
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={service.beforeSrc}
                          alt={t(`items.${service.key}.title`)}
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                            <Play className="w-7 h-7 text-white ml-1" />
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Before/After slider for non-video services */
                      <BeforeAfterSlider
                        beforeSrc={service.beforeSrc}
                        afterSrc={service.afterSrc}
                        beforeLabel="Antes"
                        afterLabel="Depois"
                        height="h-full"
                        hideLabels
                      />
                    )}

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                        {t(`items.${service.key}.badge`)}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.iconBg} flex items-center justify-center shadow-lg shadow-black/50`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-xs text-white/60 mb-2 font-medium uppercase tracking-wider">
                      {t(`items.${service.key}.subtitle`)}
                    </p>
                    <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                      {t(`items.${service.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed mb-5 line-clamp-2">
                      {t(`items.${service.key}.description`)}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => handleTryNow(e, service.slug)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-accent-violet transition-colors"
                      >
                        {t('tryNow')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-accent-violet/20 via-transparent to-accent-blue/20 blur-xl" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href={`/${locale}/app`}
            className="inline-flex items-center gap-2 bg-gradient-accent text-white font-semibold px-8 py-4 rounded-btn hover:opacity-90 transition-opacity shadow-lg shadow-accent-violet/25"
          >
            {t('tryNow')} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
