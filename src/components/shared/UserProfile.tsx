'use client';

/**
 * UserProfile — compact avatar button with a popover menu.
 * Designed to live in the navbar: shows user's avatar + name,
 * expands on click to reveal profile info, dashboard link, settings,
 * and a sign-out action.
 *
 * Usage (in Navbar):
 *   const { status } = useSession();
 *   status === 'authenticated' ? <UserProfile locale={locale} /> : <SignInButton />
 */

import { useEffect, useRef, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Settings,
  CreditCard,
  User as UserIcon,
} from 'lucide-react';

interface UserProfileProps {
  locale: string;
  align?: 'start' | 'end';
}

export default function UserProfile({ locale, align = 'end' }: UserProfileProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [open]);

  if (!session?.user) return null;

  const { name, email, image } = session.user;
  const firstInitial = name?.[0] ?? email?.[0] ?? '?';
  const displayName = name ?? email ?? 'Usuário';

  const handleSignOut = async () => {
    setOpen(false);
    await signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={displayName}
            className="w-7 h-7 rounded-full border border-white/10"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-violet to-accent-fuchsia flex items-center justify-center text-xs font-bold text-white">
            {firstInitial.toUpperCase()}
          </div>
        )}
        <span className="hidden md:block text-xs font-medium text-white max-w-[120px] truncate">
          {name?.split(' ')[0] ?? email}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className={`absolute ${
              align === 'end' ? 'right-0' : 'left-0'
            } mt-2 w-64 bg-gradient-to-br from-[#0a0a0a] to-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50`}
          >
            {/* Profile header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={displayName}
                  className="w-11 h-11 rounded-full border border-white/10"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-violet to-accent-fuchsia flex items-center justify-center text-base font-bold text-white">
                  {firstInitial.toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {displayName}
                </p>
                {name && email && (
                  <p className="text-[11px] text-muted truncate">{email}</p>
                )}
              </div>
            </div>

            {/* Menu items */}
            <nav className="py-1">
              <Link
                href={`/${locale}/dashboard`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/90 hover:bg-white/5 transition-colors"
                role="menuitem"
              >
                <LayoutDashboard className="w-4 h-4 text-accent-violet" />
                Painel
              </Link>
              <Link
                href={`/${locale}/dashboard`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/90 hover:bg-white/5 transition-colors"
                role="menuitem"
              >
                <CreditCard className="w-4 h-4 text-accent-blue" />
                Faturamento
              </Link>
              <Link
                href={`/${locale}/dashboard`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/90 hover:bg-white/5 transition-colors"
                role="menuitem"
              >
                <UserIcon className="w-4 h-4 text-accent-emerald" />
                Perfil
              </Link>
              <Link
                href={`/${locale}/dashboard`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/90 hover:bg-white/5 transition-colors"
                role="menuitem"
              >
                <Settings className="w-4 h-4 text-accent-amber" />
                Configurações
              </Link>
            </nav>

            <div className="border-t border-white/5">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-accent-rose hover:bg-accent-rose/5 transition-colors"
                role="menuitem"
              >
                <LogOut className="w-4 h-4" />
                Sair da conta
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
