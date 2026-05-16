'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy,
  Coins, 
  Gem, 
  User,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_USER } from '@/lib/mock-data';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'INÍCIO', path: '/' },
    { name: 'ÁLBUNS', path: '/album' },
    { name: 'INVENTÁRIO', path: '/inventory' },
    { name: 'MERCADO', path: '/marketplace' },
    { name: 'PACOTES', path: '/packs' },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const currentUser = user ? MOCK_USER : null;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 font-outfit",
        "py-0"
      )}
    >
      <div className={cn(
        "max-w-[1600px] mx-auto flex items-center justify-between px-4 md:px-8 transition-all duration-500",
        isScrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/10" : "bg-black/60 backdrop-blur-md border-b border-white/5"
      )}>
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 md:gap-4 group py-3">
          <div className="w-9 h-9 md:w-12 md:h-12 bg-primary rounded-md flex items-center justify-center shadow-gold-glow group-hover:scale-110 transition-transform">
            <Trophy className="text-black" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-2xl font-black text-white italic tracking-wider leading-none font-bebas group-hover:text-primary transition-colors">FIFA 2026</span>
            <span className="text-[6px] md:text-[8px] font-black text-primary uppercase tracking-[0.4em]">ÁLBUM OFICIAL</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-12">
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
        <div className="flex items-center gap-3 md:gap-8">
          {currentUser ? (
            <>
              {/* Currencies - Hidden on tiny screens, shown from md up */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white/5 px-4 md:px-6 py-2 md:py-3 rounded-md border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                  <Coins size={16} className="text-amber-400" />
                  <span className="text-xs md:text-sm font-black text-white italic font-bebas">{currentUser.coins.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-4 md:px-6 py-2 md:py-3 rounded-md border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                  <Gem size={16} className="text-purple-400" />
                  <span className="text-xs md:text-sm font-black text-white italic font-bebas">{currentUser.gems}</span>
                </div>
              </div>

              <div className="hidden md:block h-8 md:h-10 w-px bg-white/10" />

              <div className="flex items-center gap-2 md:gap-4">
                <button 
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-3 md:gap-4 group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-md flex items-center justify-center group-hover:scale-105 transition-all shadow-gold-glow">
                    <User size={20} className="text-black" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start text-left">
                    <span className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-wider leading-none group-hover:text-primary transition-colors">{currentUser.username}</span>
                    <span className="text-[8px] md:text-[9px] font-bold text-primary uppercase tracking-widest mt-1">Nível {currentUser.level}</span>
                  </div>
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="p-2.5 md:p-3 bg-white/5 hover:bg-red-500/20 rounded-md border border-white/10 hover:border-red-500/30 transition-all text-white/40 hover:text-red-400"
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <Link 
              href="/login"
              className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:gap-3 bg-primary rounded-md hover:scale-105 transition-all shadow-gold-glow"
            >
              <User size={20} className="text-black" />
              <span className="hidden md:inline font-black text-xs md:text-sm uppercase tracking-wider text-black ml-2">Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}