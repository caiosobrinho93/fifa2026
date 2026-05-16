'use client';

import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  BookOpen, 
  Store, 
  PackageOpen,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    { name: 'Início', icon: Home, path: '/' },
    { name: 'Cards', icon: LayoutDashboard, path: '/inventory' },
    { name: 'Packs', icon: PackageOpen, path: '/packs', special: true },
    { name: 'Álbum', icon: BookOpen, path: '/album' },
    { name: 'Loja', icon: Store, path: '/marketplace' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-8 pt-4 lg:hidden pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10 rounded-full" />
        
        <div className="bg-[#0a0a0c]/90 backdrop-blur-3xl border border-white/10 rounded-[32px] px-4 py-3 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {items.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            if (item.special) {
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className="relative -top-10 group"
                >
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-gold-glow rotate-45 group-hover:rotate-[225deg] transition-all duration-500">
                    <Icon className="text-black -rotate-45 group-hover:rotate-[-225deg] transition-all duration-500" size={28} />
                  </div>
                  <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full -z-10" />
                </Link>
              );
            }

            return (
              <Link 
                key={item.path} 
                href={item.path}
                className="flex flex-col items-center justify-center w-14 py-1.5 transition-all relative"
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all",
                  isActive ? "bg-primary/10 text-primary" : "text-white/30"
                )}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-[0.1em] mt-1 transition-all",
                  isActive ? "text-primary opacity-100" : "text-white/20 opacity-0"
                )}>
                  {item.name}
                </span>

                {isActive && (
                  <motion.div 
                    layoutId="active-nav-dot"
                    className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#f59e0b]"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
