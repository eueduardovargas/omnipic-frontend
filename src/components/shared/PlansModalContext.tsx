'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import PlansModal from './PlansModal';

interface PlansModalContextType {
  openPlans: () => void;
  closePlans: () => void;
  isPlansOpen: boolean;
}

const PlansModalContext = createContext<PlansModalContextType | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
  locale: string;
}

export function PlansModalProvider({ children, locale }: ProviderProps) {
  const [isPlansOpen, setIsPlansOpen] = useState(false);

  const openPlans = () => setIsPlansOpen(true);
  const closePlans = () => setIsPlansOpen(false);

  return (
    <PlansModalContext.Provider value={{ openPlans, closePlans, isPlansOpen }}>
      {children}
      <PlansModal isOpen={isPlansOpen} onClose={closePlans} locale={locale} />
    </PlansModalContext.Provider>
  );
}

export function usePlansModal() {
  const ctx = useContext(PlansModalContext);
  if (!ctx) {
    // Return safe no-op fallback so it doesn't crash if used outside provider
    return {
      openPlans: () => {},
      closePlans: () => {},
      isPlansOpen: false,
    };
  }
  return ctx;
}
