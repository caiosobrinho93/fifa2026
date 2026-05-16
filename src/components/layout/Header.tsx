'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trophy,
  Coins, 
  Gem, 
  User,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Inventário', path: '/inventory' },
    { name: 'Álbum', path: '/album' },
    { name: 'Mercado', path: '/marketplace' },
    { name: 'Packs', path: '/packs' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 font-outfit",
        "hidden lg:block", // REMOVE FROM MOBILE COMPLETELY
        isScrolled ? "py-4" : "py-8"
      )}
    >
      <div className={cn(
        "max-w-[1400px] mx-auto flex items-center justify-between transition-all duration-500 rounded-3xl px-10 py-4 bg-[#0a0a0c]/80 backdrop-blur-3xl border border-white/5",
        isScrolled ? "shadow-2xl" : ""
      )}>
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-gold-glow group-hover:scale-110 transition-transform">
            <Trophy className="text-black" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white italic tracking-wider leading-none font-bebas">FIFA 2026</span>
            <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">Official Album</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="flex items-center gap-12">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:text-primary relative group",
                pathname === item.path ? "text-primary" : "text-white/40"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                <Coins size={18} className="text-gold" />
                <span className="text-sm font-black text-white italic font-bebas">12,500</span>
             </div>
             <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                <Gem size={18} className="text-secondary" />
                <span className="text-sm font-black text-white italic font-bebas">450</span>
             </div>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <button className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-[#0f172a] rounded-2xl border border-white/10 flex items-center justify-center group-hover:border-primary transition-all">
               <User size={22} className="text-white/40" />
            </div>
            <div className="flex flex-col items-start">
               <span className="text-[11px] font-black text-white uppercase tracking-wider leading-none">Caio</span>
               <span className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1">Nível 15</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
