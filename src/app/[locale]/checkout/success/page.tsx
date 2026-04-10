'use client';

import { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

function CheckoutSuccessContent() {
  const params = useParams();
  const locale = params.locale as string;
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <section className="min-h-screen pt-32 pb-24 px-4 relative overflow-hidden flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent-emerald/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-emerald/30 to-accent-emerald/10 border border-accent-emerald/40 mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-accent-emerald" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent"
        >
          Pagamento confirmado!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-base md:text-lg text-muted mb-8 max-w-lg mx-auto"
        >
          Sua assinatura está ativa. Você já pode começar a usar todos os recursos
          do OmniPic agora mesmo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-violet to-accent-fuchsia hover:opacity-90 text-white font-bold shadow-lg shadow-accent-violet/40 transition-all w-full sm:w-auto"
          >
            Ir para o painel
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={`/${locale}/app/processar`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all w-full sm:w-auto"
          >
            <Sparkles className="w-4 h-4" />
            Começar a processar
          </Link>
        </motion.div>

        {sessionId && (
          <p className="mt-8 text-[11px] text-muted/60 font-mono break-all">
            ID da sessão: {sessionId}
          </p>
        )}
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
