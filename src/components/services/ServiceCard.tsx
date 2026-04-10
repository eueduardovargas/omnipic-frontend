'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Focus, AudioLines, Clock, Maximize2, Palette, Smile, Mountain,
  Sparkles, Video, UserPlus, Eraser, Wand2, ArrowRight,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Focus, AudioLines, Clock, Maximize2, Palette, Smile, Mountain,
  Sparkles, Video, UserPlus, Eraser, Wand2,
};

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  slug: string;
  locale: string;
}

export default function ServiceCard({ icon, title, description, slug, locale }: ServiceCardProps) {
  const IconComponent = iconMap[icon] || Sparkles;

  return (
    <Link href={`/${locale}/servicos/${slug}`}>
      <motion.div
        className="glass-card p-6 hover:bg-white/10 transition-colors cursor-pointer h-full"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="w-12 h-12 mb-4 rounded-xl bg-accent-violet/10 flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-accent-violet" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted text-sm leading-relaxed mb-4">{description}</p>
        <span className="flex items-center gap-1 text-accent-violet text-sm font-medium">
          <ArrowRight className="w-4 h-4" />
        </span>
      </motion.div>
    </Link>
  );
}
