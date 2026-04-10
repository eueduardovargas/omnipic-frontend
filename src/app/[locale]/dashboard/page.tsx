'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Crown,
  CalendarDays,
  CreditCard,
  Loader2,
  Sparkles,
  Settings,
  ArrowUpRight,
  ReceiptText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { usePayments } from '@/hooks/usePayments';
import type { SubscriptionStatus, PaymentStatus } from '@/lib/supabase/types';

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatCurrency(cents: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function statusMeta(status: SubscriptionStatus | undefined) {
  switch (status) {
    case 'active':
    case 'trialing':
      return {
        label: 'Ativa',
        tone: 'emerald' as const,
        icon: CheckCircle2,
      };
    case 'past_due':
    case 'unpaid':
      return {
        label: 'Pagamento pendente',
        tone: 'amber' as const,
        icon: AlertTriangle,
      };
    case 'canceled':
    case 'incomplete_expired':
      return {
        label: 'Cancelada',
        tone: 'rose' as const,
        icon: AlertTriangle,
      };
    default:
      return {
        label: 'Inativa',
        tone: 'muted' as const,
        icon: Clock,
      };
  }
}

const statusToneClasses: Record<string, string> = {
  emerald: 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald/40',
  amber: 'bg-accent-amber/15 text-accent-amber border-accent-amber/40',
  rose: 'bg-accent-rose/15 text-accent-rose border-accent-rose/40',
  muted: 'bg-white/5 text-muted border-white/10',
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  succeeded: 'Aprovado',
  pending: 'Pendente',
  failed: 'Falhou',
  refunded: 'Reembolsado',
};

export default function DashboardPage() {
  const params = useParams();
  const locale = params.locale as string;
  const { data: session, status: authStatus } = useSession();
  const {
    subscription,
    loading: subLoading,
    error: subError,
  } = useSubscription();
  const { payments, loading: paymentsLoading } = usePayments({ limit: 10 });
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const meta = useMemo(
    () => statusMeta(subscription?.status),
    [subscription?.status],
  );

  const handleManageBilling = async () => {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Failed to open billing portal');
      }
      window.location.href = data.url;
    } catch (e) {
      setPortalError(e instanceof Error ? e.message : String(e));
      setPortalLoading(false);
    }
  };

  const isLoading = authStatus === 'loading' || subLoading;

  return (
    <section className="min-h-screen pt-32 pb-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-accent-violet/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-accent-fuchsia/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-muted mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent-violet" />
            Painel da conta
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
            Olá, {session?.user?.name?.split(' ')[0] ?? 'bem-vindo'}!
          </h1>
          <p className="text-muted">
            Gerencie sua assinatura, pagamentos e preferências da conta.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-muted">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Carregando...
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {/* Subscription status */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 rounded-3xl p-6 bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4 text-accent-violet" />
                    <span className="text-xs uppercase tracking-wider text-muted font-semibold">
                      Assinatura
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {subscription?.plan_type === 'weekly'
                      ? 'Plano Semanal'
                      : subscription?.plan_type === 'monthly'
                        ? 'Plano Mensal'
                        : subscription?.plan_type === 'annual'
                          ? 'Plano Anual'
                          : 'Sem plano ativo'}
                  </h2>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${
                    statusToneClasses[meta.tone]
                  }`}
                >
                  <meta.icon className="w-3 h-3" />
                  {meta.label}
                </span>
              </div>

              {subscription ? (
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted mb-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      Início do período
                    </div>
                    <p className="text-sm text-white font-medium">
                      {formatDate(subscription.current_period_start, locale)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted mb-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      Próxima renovação
                    </div>
                    <p className="text-sm text-white font-medium">
                      {formatDate(subscription.current_period_end, locale)}
                    </p>
                  </div>
                  {subscription.cancel_at_period_end && (
                    <div className="sm:col-span-2 flex items-center gap-2 text-xs text-accent-amber px-3 py-2 rounded-lg bg-accent-amber/10 border border-accent-amber/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Sua assinatura será cancelada ao final do período.
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted mb-6">
                  Você ainda não tem um plano ativo. Escolha um plano para
                  começar a usar todos os recursos do OmniPic.
                </p>
              )}

              {subError && (
                <p className="text-xs text-accent-rose mb-3">
                  {subError.message}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {subscription ? (
                  <button
                    onClick={handleManageBilling}
                    disabled={portalLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-violet to-accent-fuchsia hover:opacity-90 text-white font-semibold text-sm shadow-lg shadow-accent-violet/30 transition-all disabled:opacity-60"
                  >
                    {portalLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Settings className="w-4 h-4" />
                    )}
                    Gerenciar faturamento
                  </button>
                ) : (
                  <Link
                    href={`/${locale}/planos`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-violet to-accent-fuchsia hover:opacity-90 text-white font-semibold text-sm shadow-lg shadow-accent-violet/30 transition-all"
                  >
                    <Crown className="w-4 h-4" />
                    Ver planos
                  </Link>
                )}

                <Link
                  href={`/${locale}/app/processar`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all"
                >
                  Começar a processar
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              {portalError && (
                <p className="text-xs text-accent-rose mt-3">{portalError}</p>
              )}
            </motion.div>

            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-3xl p-6 bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                {session?.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? ''}
                    className="w-12 h-12 rounded-full border border-white/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-violet to-accent-fuchsia flex items-center justify-center text-white font-bold">
                    {session?.user?.name?.[0] ?? '?'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {session?.user?.name ?? 'Usuário'}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
                Login seguro via Google
              </div>
            </motion.div>

            {/* Payment history */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-3 rounded-3xl p-6 bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <ReceiptText className="w-4 h-4 text-accent-violet" />
                  <h3 className="text-lg font-bold text-white">
                    Histórico de pagamentos
                  </h3>
                </div>
                <span className="text-xs text-muted">
                  {payments.length} registro{payments.length === 1 ? '' : 's'}
                </span>
              </div>

              {paymentsLoading ? (
                <div className="py-8 text-muted text-sm flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Carregando...
                </div>
              ) : payments.length === 0 ? (
                <div className="py-8 text-muted text-sm text-center">
                  Nenhum pagamento registrado ainda.
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {payments.map((payment) => (
                    <li
                      key={payment.id}
                      className="py-3 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">
                          {payment.description ?? 'Assinatura OmniPic'}
                        </p>
                        <p className="text-[11px] text-muted">
                          {formatDate(payment.created_at, locale)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            payment.status === 'succeeded'
                              ? 'bg-accent-emerald/15 text-accent-emerald'
                              : payment.status === 'failed'
                                ? 'bg-accent-rose/15 text-accent-rose'
                                : 'bg-white/5 text-muted'
                          }`}
                        >
                          {paymentStatusLabels[payment.status]}
                        </span>
                        <span className="text-sm text-white font-semibold tabular-nums">
                          {formatCurrency(
                            payment.amount_cents,
                            payment.currency,
                            locale,
                          )}
                        </span>
                        {payment.receipt_url && (
                          <a
                            href={payment.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted hover:text-white transition-colors"
                            aria-label="Ver recibo"
                          >
                            <CreditCard className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
