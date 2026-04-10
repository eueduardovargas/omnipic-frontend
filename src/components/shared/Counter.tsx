'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface CounterProps {
  value: string;
  label: string;
}

export default function Counter({ value, label }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState('0');

  const numericPart = value.replace(/[^0-9]/g, '');
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!isInView) return;
    const target = parseInt(numericPart);
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayValue(target.toString());
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current).toString());
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, numericPart]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
        {displayValue}{suffix}
      </div>
      <div className="text-muted text-lg">{label}</div>
    </motion.div>
  );
}
