'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Coins, Gem, Swords } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatarMenu } from './UserAvatarMenu';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'INÍCIO',     path: '/' },
    { name: 'ÁLBUNS',     path: '/album' },
    { name: 'INVENTÁRIO', path: '/inventory' },
    { name: 'MERCADO',    path: '/marketplace' },
    { name: 'PACOTES',    path: '/packs' },
    { name: 'DESAFIOS',   path: '/challenges', icon: Swords },
  ];

  const userCoins = user?.user_metadata?.coins ?? 0;
  const userGems  = user?.user_metadata?.gems  ?? 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 font-outfit">
      <div className={cn(
        'max-w-[1600px] mx-auto flex items-center justify-between px-4 md:px-8 transition-all duration-500',
        isScrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10'
          : 'bg-black/60 backdrop-blur-md border-b border-white/5'
      )}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 md:gap-4 group py-3">
          <div className="w-9 h-9 md:w-12 md:h-12 bg-primary rounded-md flex items-center justify-center shadow-gold-glow group-hover:scale-110 transition-transform">
            <Trophy className="text-black" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-2xl font-black text-white italic tracking-wider leading-none font-bebas group-hover:text-primary transition-colors">FIFA 2026</span>
            <span className="text-[6px] md:text-[8px] font-black text-primary uppercase tracking-[0.4em]">ÁLBUM OFICIAL</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:text-primary flex items-center gap-1.5',
                pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
                  ? 'text-primary'
                  : 'text-white/40'
              )}
            >
              {item.icon && <item.icon size={12} />}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-5">
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-md border border-white/5">
                <Coins size={13} className="text-amber-400" />
                <span className="text-sm font-black text-white italic font-bebas">{userCoins.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-md border border-white/5">
                <Gem size={13} className="text-purple-400" />
                <span className="text-sm font-black text-white italic font-bebas">{userGems}</span>
              </div>
            </div>
          )}
          <UserAvatarMenu />
        </div>
      </div>
    </header>
  );
}