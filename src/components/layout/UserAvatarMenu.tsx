'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { User, Package, Swords, Settings, LogOut, Trophy, ChevronDown } from 'lucide-react';

export function UserAvatarMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary rounded-md hover:scale-105 transition-all shadow-gold-glow text-black font-black text-xs uppercase tracking-widest"
      >
        <User size={16} className="text-black shrink-0" />
        <span className="hidden md:inline">Entrar</span>
      </Link>
    );
  }

  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'Player';
  const initials = username.slice(0, 2).toUpperCase();
  const level = user.user_metadata?.level ?? 1;

  const menuItems = [
    { label: 'Ver Perfil',   icon: User,     href: '/profile' },
    { label: 'Inventário',   icon: Package,  href: '/inventory' },
    { label: 'Desafios',     icon: Swords,   href: '/challenges' },
  ];

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    router.push('/login');
  };

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 group"
        aria-label="Menu do perfil"
      >
        {/* Avatar circular com gradiente */}
        <div className="relative w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-black shadow-gold-glow transition-transform group-hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
        >
          {initials}
          {/* Indicador de nível */}
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-background border border-primary rounded-full flex items-center justify-center text-[7px] font-black text-primary leading-none">
            {level}
          </span>
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-[10px] font-black text-white uppercase tracking-wider leading-none group-hover:text-primary transition-colors">
            {username}
          </span>
          <span className="text-[8px] text-white/30 uppercase tracking-widest">Nível {level}</span>
        </div>
        <ChevronDown
          size={12}
          className={`text-white/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown glassmorphism */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute right-0 top-full mt-3 w-52 z-[200] origin-top-right"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
              {/* Header do dropdown */}
              <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-black"
                    style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="text-white text-xs font-black uppercase tracking-wider">{username}</p>
                    <p className="text-white/30 text-[9px] font-bold">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Itens do menu */}
              <div className="py-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 transition-all group"
                  >
                    <item.icon size={15} className="text-white/30 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Divider + Sair */}
              <div className="border-t border-white/5 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all group"
                >
                  <LogOut size={15} className="group-hover:text-red-400 transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-widest">Sair</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
