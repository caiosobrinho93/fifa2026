'use client';

import React from 'react';
import { 
  Home, 
  BookOpen, 
  Store, 
  PackageOpen,
  User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    { name: 'Início', icon: Home, path: '/' },
    { name: 'Álbuns', icon: BookOpen, path: '/album' },
    { name: 'Pacotes', icon: PackageOpen, path: '/packs', special: true },
    { name: 'Mercado', icon: Store, path: '/marketplace' },
    { name: 'Perfil', icon: User, path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden border-t border-white/5 bg-[#080910]/98 backdrop-blur-xl">
      <div className="flex items-stretch justify-around h-[68px]">
        {items.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          const Icon = item.icon;
          
          if (item.special) {
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className="flex flex-col items-center justify-center flex-1 relative group"
              >
                {/* Botão especial de Pacotes com destaque elevado */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg -mt-4",
                  isActive 
                    ? "bg-primary shadow-[0_0_20px_rgba(59,130,246,0.6)]" 
                    : "bg-primary/80 group-active:scale-95"
                )}>
                  <Icon size={22} className="text-black" strokeWidth={2.5} />
                </div>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-wider mt-1 transition-colors",
                  isActive ? "text-primary" : "text-white/30"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link 
              key={item.path} 
              href={item.path}
              className="flex flex-col items-center justify-center flex-1 transition-all relative pt-1"
            >
              {/* Active indicator bar on top */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}

              <div className={cn(
                "p-1.5 rounded-lg transition-all",
                isActive ? "bg-primary/10" : ""
              )}>
                <Icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 1.8} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-primary" : "text-white/25"
                  )}
                />
              </div>
              
              <span className={cn(
                "text-[8px] font-black uppercase tracking-wider transition-colors mt-0.5",
                isActive ? "text-primary" : "text-white/20"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer para dispositivos com home indicator */}
      <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} className="bg-[#080910]/98" />
    </div>
  );
}
