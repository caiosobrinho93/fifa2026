'use client';

import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  BookOpen, 
  Store, 
  PackageOpen
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    { name: 'INÍCIO', icon: Home, path: '/' },
    { name: 'ÁLBUNS', icon: BookOpen, path: '/album' },
    { name: 'INVENTÁRIO', icon: LayoutDashboard, path: '/inventory' },
    { name: 'MERCADO', icon: Store, path: '/marketplace' },
    { name: 'PACOTES', icon: PackageOpen, path: '/packs', special: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden border-t border-white/5 bg-[#0a0b10]/95 backdrop-blur-xl">
      <div className="flex items-stretch justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 transition-all relative border-t-2",
                isActive ? "border-primary bg-primary/5" : "border-transparent"
              )}
            >
              <div className={cn(
                "transition-all mb-0.5",
                isActive ? "text-primary scale-110" : "text-white/20 group-hover:text-white/40"
              )}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className={cn(
                "text-[7px] font-black uppercase tracking-[0.2em] transition-all",
                isActive ? "text-primary" : "text-white/20"
              )}>
                {item.name}
              </span>

              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-px bg-primary shadow-[0_0_15px_var(--primary)]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
