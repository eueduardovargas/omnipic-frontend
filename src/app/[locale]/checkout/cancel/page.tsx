'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  const params = useParams();
  const locale = params.locale as string;

  return (
    <section className="min-h-screen pt-32 pb-24 px-4 relative overflow-hidden flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent-rose/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-rose/30 to-accent-rose/10 border border-accent-rose/40 mb-6"
        >
          <XCircle className="w-10 h-10 text-accent-rose" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-white"
        >
          Checkout cancelado
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-base md:text-lg text-muted mb-8 max-w-lg mx-auto"
        >
          Nenhum valor foi cobrado. Você pode voltar e escolher outro plano a
          qualquer momento.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href={`/${locale}/planos`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-violet to-accent-fuchsia hover:opacity-90 text-white font-bold shadow-lg shadow-accent-violet/40 transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos planos
          </Link>
          <Link
            href={`/${locale}/suporte`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all w-full sm:w-auto"
          >
            <HelpCircle className="w-4 h-4" />
            Falar com suporte
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
