'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  FileText,
  GraduationCap,
  Newspaper,
  Building2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import OmnipicLogo from '@/components/layout/OmnipicLogo';

const supportSchema = z.object({
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
  subject: z.string().min(1, 'subjectRequired'),
  message: z.string().min(10, 'messageMin'),
});

type SupportForm = z.infer<typeof supportSchema>;

export default function SuportePage() {
  const t = useTranslations('supportPage');
  const params = useParams();
  const locale = params.locale as string;
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<SupportForm>({
    resolver: zodResolver(supportSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SupportForm) => {
    setSubmitState('submitting');
    try {
      // Mock API call - in production this would POST to /api/support
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Support request:', { ...data, locale });
      setSubmitState('success');
      reset();
      setTimeout(() => setSubmitState('idle'), 5000);
    } catch (e) {
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 5000);
    }
  };

  const links = [
    { icon: Newspaper, label: t('blog'), href: '#' },
    { icon: BookOpen, label: t('resources'), href: '#' },
    { icon: FileText, label: t('documentation'), href: '#' },
    { icon: GraduationCap, label: t('tutorials'), href: '#' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-accent-violet/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-muted mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
            <span>OmniPic Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>
          <p className="text-muted text-lg">{t('subtitle')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left column: Company info + links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Company info card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <OmnipicLogo className="w-10 h-10" />
                <div>
                  <h3 className="font-bold text-white">{t('companyTitle')}</h3>
                  <p className="text-xs text-muted flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    omnipic.net
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-5">
                {t('companyDescription')}
              </p>
              <div className="flex items-center gap-2 text-sm text-accent-violet">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@omnipic.net" className="hover:underline">
                  support@omnipic.net
                </a>
              </div>
            </div>

            {/* Useful links */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                {t('usefulLinks')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-violet/40 hover:bg-white/10 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-violet/20 to-accent-blue/20 flex items-center justify-center group-hover:from-accent-violet/30 group-hover:to-accent-blue/30 transition-all">
                        <Icon className="w-4 h-4 text-accent-violet" />
                      </div>
                      <span className="text-sm text-white font-medium">{link.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right column: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-violet to-accent-blue flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">{t('formTitle')}</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email field */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('fields.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder={t('placeholders.email')}
                      {...register('email')}
                      className={`w-full bg-white/5 border ${
                        errors.email ? 'border-red-500/50' : 'border-white/10'
                      } rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-muted/60 focus:outline-none focus:border-accent-violet/60 transition-colors`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {t(`validation.${errors.email.message}`)}
                    </p>
                  )}
                </div>

                {/* Subject dropdown */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('fields.subject')}
                  </label>
                  <select
                    {...register('subject')}
                    defaultValue=""
                    className={`w-full bg-white/5 border ${
                      errors.subject ? 'border-red-500/50' : 'border-white/10'
                    } rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-violet/60 transition-colors appearance-none cursor-pointer`}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.25rem',
                      paddingRight: '3rem',
                    }}
                  >
                    <option value="" disabled>
                      {t('fields.subject')}...
                    </option>
                    <option value="bug" className="bg-background">
                      {t('subjects.bug')}
                    </option>
                    <option value="question" className="bg-background">
                      {t('subjects.question')}
                    </option>
                    <option value="suggestion" className="bg-background">
                      {t('subjects.suggestion')}
                    </option>
                    <option value="billing" className="bg-background">
                      {t('subjects.billing')}
                    </option>
                    <option value="other" className="bg-background">
                      {t('subjects.other')}
                    </option>
                  </select>
                  {errors.subject && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {t(`validation.${errors.subject.message}`)}
                    </p>
                  )}
                </div>

                {/* Message field */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('fields.message')}
                  </label>
                  <textarea
                    rows={6}
                    placeholder={t('placeholders.message')}
                    {...register('message')}
                    className={`w-full bg-white/5 border ${
                      errors.message ? 'border-red-500/50' : 'border-white/10'
                    } rounded-xl px-4 py-3 text-white placeholder:text-muted/60 focus:outline-none focus:border-accent-violet/60 transition-colors resize-none`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {t(`validation.${errors.message.message}`)}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!isValid || submitState === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-violet to-accent-blue text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-accent-violet/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitState === 'submitting' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('submit')}
                    </>
                  )}
                </button>

                {/* Success/Error feedback */}
                {submitState === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-accent-emerald/10 border border-accent-emerald/30 rounded-xl text-accent-emerald text-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    {t('success')}
                  </motion.div>
                )}
                {submitState === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {t('error')}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
