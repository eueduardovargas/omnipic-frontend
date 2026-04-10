'use client';

import { useState, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Check,
  Shield,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import OmnipicLogo from '@/components/layout/OmnipicLogo';

const loginSchema = z.object({
  email: z.string().min(1, 'required').email('invalidEmail'),
  password: z.string().min(1, 'required').min(8, 'minLength'),
});

const registerSchema = z
  .object({
    name: z.string().min(1, 'required'),
    email: z.string().min(1, 'required').email('invalidEmail'),
    password: z.string().min(1, 'required').min(8, 'minLength'),
    confirmPassword: z.string().min(1, 'required'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'termsRequired' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwordMismatch',
    path: ['confirmPassword'],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

// Google G icon (multicolor)
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// Apple icon
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function AuthPageContent() {
  const t = useTranslations('auth');
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Persist mock user session in localStorage so isAuthenticated() returns true
  const persistUser = (email: string, name?: string) => {
    try {
      localStorage.setItem(
        'omnipic-user',
        JSON.stringify({ id: email, email, name: name || email.split('@')[0] })
      );
    } catch (e) {
      // ignore localStorage errors (Safari private mode etc.)
    }
  };

  // After login/register, route based on optional ?redirect param (e.g. came from a service card)
  const redirectAfterAuth = () => {
    const redirect = searchParams?.get('redirect');
    const service = searchParams?.get('service');
    if (redirect === 'service' && service) {
      router.push(`/${locale}/app/processar?service=${service}`);
    } else {
      router.push(`/${locale}/app`);
    }
  };

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false as unknown as true,
    },
    mode: 'onChange',
  });

  const onLoginSubmit = (values: LoginFormData) => {
    persistUser(values.email);
    redirectAfterAuth();
  };

  const onRegisterSubmit = (values: RegisterFormData) => {
    persistUser(values.email, values.name);
    redirectAfterAuth();
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    if (provider !== 'google') {
      // Apple is not yet configured — keep the legacy mock for now.
      persistUser(`${provider}-user@example.com`, `${provider} user`);
      redirectAfterAuth();
      return;
    }

    setGoogleLoading(true);
    // Build the post-login callback URL so we land on the intended page
    // (dashboard by default, or the service flow if we came from one).
    const redirect = searchParams?.get('redirect');
    const service = searchParams?.get('service');
    const plan = searchParams?.get('plan');
    const callbackParam = searchParams?.get('callbackUrl');

    let callbackUrl = `/${locale}/dashboard`;
    if (callbackParam) {
      callbackUrl = callbackParam;
    } else if (redirect === 'service' && service) {
      callbackUrl = `/${locale}/app/processar?service=${service}`;
    } else if (plan) {
      callbackUrl = `/${locale}/planos?plan=${plan}`;
    }

    await signIn('google', { callbackUrl });
    // NextAuth redirects the browser; if we're still here, stop the spinner.
    setGoogleLoading(false);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setForgotMode(false);
    }, 3000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-violet/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,var(--bg-primary,#0a0a0a)_100%)]" />
      </div>

      <motion.div
        className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left side: Branding (desktop only) */}
        <div className="hidden lg:flex flex-col justify-center">
          <Link href={`/${locale}`} className="flex items-center gap-3 mb-8">
            <OmnipicLogo className="w-14 h-14" />
            <span className="text-3xl font-bold tracking-tight">
              Omni
              <span className="bg-gradient-to-r from-accent-violet to-accent-blue bg-clip-text text-transparent">
                Pic
              </span>
            </span>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-muted text-lg mb-8 leading-relaxed">{t('subtitle')}</p>

          {/* Trust signals */}
          <div className="space-y-3">
            {[
              { icon: Sparkles, text: 'IA de última geração' },
              { icon: Shield, text: 'Privacidade e segurança total' },
              { icon: Check, text: 'Cancele a qualquer momento' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-muted"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-accent/20 border border-accent-violet/30 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-accent-violet" />
                </div>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side: Auth form */}
        <div className="flex items-center">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile logo */}
            <Link
              href={`/${locale}`}
              className="lg:hidden flex items-center justify-center gap-2 mb-8"
            >
              <OmnipicLogo className="w-10 h-10" />
              <span className="text-xl font-bold">
                Omni
                <span className="bg-gradient-to-r from-accent-violet to-accent-blue bg-clip-text text-transparent">
                  Pic
                </span>
              </span>
            </Link>

            <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
              <AnimatePresence mode="wait">
                {forgotMode ? (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold mb-2">{t('forgotPassword.title')}</h2>
                    <p className="text-muted text-sm mb-6">{t('forgotPassword.description')}</p>

                    {forgotSent ? (
                      <div className="bg-accent-emerald/10 border border-accent-emerald/30 rounded-xl p-4 text-accent-emerald text-sm flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        {t('forgotPassword.sent')}
                      </div>
                    ) : (
                      <form onSubmit={handleForgotSubmit} className="space-y-4">
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                          <input
                            type="email"
                            required
                            placeholder={t('placeholders.email')}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-accent-violet transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-gradient-accent text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
                        >
                          {t('forgotPassword.submit')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setForgotMode(false)}
                          className="w-full text-sm text-muted hover:text-white transition-colors"
                        >
                          ← {t('forgotPassword.backToLogin')}
                        </button>
                      </form>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="auth"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Tabs */}
                    <div className="flex mb-6 bg-white/5 rounded-2xl p-1">
                      <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                          isLogin
                            ? 'bg-gradient-accent text-white shadow-lg shadow-accent-violet/20'
                            : 'text-muted hover:text-white'
                        }`}
                      >
                        {t('tabs.login')}
                      </button>
                      <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                          !isLogin
                            ? 'bg-gradient-accent text-white shadow-lg shadow-accent-violet/20'
                            : 'text-muted hover:text-white'
                        }`}
                      >
                        {t('tabs.register')}
                      </button>
                    </div>

                    {/* Social login buttons */}
                    <div className="space-y-2.5 mb-5">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin('google')}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-white/95 transition-colors text-sm disabled:opacity-70 disabled:cursor-wait"
                      >
                        {googleLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <GoogleIcon className="w-5 h-5" />
                        )}
                        <span>{isLogin ? t('login.google') : t('register.google')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialLogin('apple')}
                        className="w-full flex items-center justify-center gap-3 bg-black border border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/5 transition-colors text-sm"
                      >
                        <AppleIcon className="w-5 h-5" />
                        <span>{isLogin ? t('login.apple') : t('register.apple')}</span>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-card/50 px-3 text-muted">
                          {isLogin ? t('login.or') : t('register.or')}
                        </span>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {isLogin ? (
                        <motion.form
                          key="loginform"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                          className="space-y-4"
                        >
                          {/* Email */}
                          <div>
                            <label className="block text-xs font-medium text-muted mb-1.5">
                              {t('fields.email')}
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                              <input
                                type="email"
                                {...loginForm.register('email')}
                                placeholder={t('placeholders.email')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-accent-violet focus:bg-white/10 transition-all"
                              />
                            </div>
                            {loginForm.formState.errors.email && (
                              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                {t(`validation.${loginForm.formState.errors.email.message}`)}
                              </p>
                            )}
                          </div>

                          {/* Password */}
                          <div>
                            <label className="block text-xs font-medium text-muted mb-1.5">
                              {t('fields.password')}
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                {...loginForm.register('password')}
                                placeholder={t('placeholders.password')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-accent-violet focus:bg-white/10 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            {loginForm.formState.errors.password && (
                              <p className="text-red-400 text-xs mt-1.5">
                                {t(`validation.${loginForm.formState.errors.password.message}`)}
                              </p>
                            )}
                          </div>

                          {/* Remember + Forgot */}
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-white/20 bg-white/5 accent-accent-violet"
                              />
                              <span className="text-xs text-muted">{t('login.rememberMe')}</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setForgotMode(true)}
                              className="text-xs text-accent-violet hover:underline font-medium"
                            >
                              {t('login.forgotPassword')}
                            </button>
                          </div>

                          {/* Submit */}
                          <button
                            type="submit"
                            className="w-full bg-gradient-accent text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-accent-violet/25 flex items-center justify-center gap-2 group"
                          >
                            {t('login.submit')}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>

                          <p className="text-center text-xs text-muted">
                            {t('login.noAccount')}{' '}
                            <button
                              type="button"
                              onClick={() => setIsLogin(false)}
                              className="text-accent-violet hover:underline font-semibold"
                            >
                              {t('login.createAccount')}
                            </button>
                          </p>
                        </motion.form>
                      ) : (
                        <motion.form
                          key="registerform"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                          className="space-y-4"
                        >
                          {/* Name */}
                          <div>
                            <label className="block text-xs font-medium text-muted mb-1.5">
                              {t('fields.name')}
                            </label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                              <input
                                type="text"
                                {...registerForm.register('name')}
                                placeholder={t('placeholders.name')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-accent-violet focus:bg-white/10 transition-all"
                              />
                            </div>
                            {registerForm.formState.errors.name && (
                              <p className="text-red-400 text-xs mt-1.5">
                                {t(`validation.${registerForm.formState.errors.name.message}`)}
                              </p>
                            )}
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-xs font-medium text-muted mb-1.5">
                              {t('fields.email')}
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                              <input
                                type="email"
                                {...registerForm.register('email')}
                                placeholder={t('placeholders.email')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-accent-violet focus:bg-white/10 transition-all"
                              />
                            </div>
                            {registerForm.formState.errors.email && (
                              <p className="text-red-400 text-xs mt-1.5">
                                {t(`validation.${registerForm.formState.errors.email.message}`)}
                              </p>
                            )}
                          </div>

                          {/* Password */}
                          <div>
                            <label className="block text-xs font-medium text-muted mb-1.5">
                              {t('fields.password')}
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                {...registerForm.register('password')}
                                placeholder={t('placeholders.password')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-accent-violet focus:bg-white/10 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            {registerForm.formState.errors.password && (
                              <p className="text-red-400 text-xs mt-1.5">
                                {t(`validation.${registerForm.formState.errors.password.message}`)}
                              </p>
                            )}
                          </div>

                          {/* Confirm Password */}
                          <div>
                            <label className="block text-xs font-medium text-muted mb-1.5">
                              {t('fields.confirmPassword')}
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                {...registerForm.register('confirmPassword')}
                                placeholder={t('placeholders.confirmPassword')}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder:text-muted/50 focus:outline-none focus:border-accent-violet focus:bg-white/10 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            {registerForm.formState.errors.confirmPassword && (
                              <p className="text-red-400 text-xs mt-1.5">
                                {t(
                                  `validation.${registerForm.formState.errors.confirmPassword.message}`
                                )}
                              </p>
                            )}
                          </div>

                          {/* Terms */}
                          <div>
                            <label className="flex items-start gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                {...registerForm.register('terms')}
                                className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 accent-accent-violet flex-shrink-0"
                              />
                              <span className="text-xs text-muted leading-relaxed">
                                {t('register.agreeTerms')}
                              </span>
                            </label>
                            {registerForm.formState.errors.terms && (
                              <p className="text-red-400 text-xs mt-1.5">
                                {t(`validation.${registerForm.formState.errors.terms.message}`)}
                              </p>
                            )}
                          </div>

                          {/* Submit */}
                          <button
                            type="submit"
                            className="w-full bg-gradient-accent text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-accent-violet/25 flex items-center justify-center gap-2 group"
                          >
                            {t('register.submit')}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>

                          <p className="text-center text-xs text-muted">
                            {t('register.hasAccount')}{' '}
                            <button
                              type="button"
                              onClick={() => setIsLogin(true)}
                              className="text-accent-violet hover:underline font-semibold"
                            >
                              {t('register.signIn')}
                            </button>
                          </p>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-accent-violet/30 border-t-accent-violet rounded-full animate-spin" />
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
