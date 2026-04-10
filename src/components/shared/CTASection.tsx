'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface CTASectionProps {
  title: string;
  subtitle: string;
  cta: string;
  href?: string;
}

export default function CTASection({ title, subtitle, cta, href = '/auth' }: CTASectionProps) {
  return (
    <section className="py-24 px-4">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>
        <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">{subtitle}</p>
        <Link
          href={href}
          className="inline-block bg-gradient-accent text-white font-semibold px-10 py-4 rounded-btn text-lg hover:opacity-90 transition-opacity"
        >
          {cta}
        </Link>
      </motion.div>
    </section>
  );
}
