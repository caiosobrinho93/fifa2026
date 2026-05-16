'use client';

import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PackageOpen, 
  Sparkles, 
  Coins, 
  Gem, 
  ChevronRight,
  Star,
  Zap,
  Trophy
} from "lucide-react";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const PACKS = [
  {
    id: 'basic',
    name: 'Pack Inicial',
    price: 500,
    currency: 'coins',
    cards: 3,
    probabilities: { mythic: '0.1%', legendary: '2%', epic: '10%', rare: '30%', common: '57.9%' },
    color: 'border-slate-500',
    glow: 'shadow-slate-500/20',
    icon: <PackageOpen className="text-slate-400" size={40} />
  },
  {
    id: 'legendary',
    name: 'Pack Lendário',
    price: 2500,
    currency: 'coins',
    cards: 5,
    probabilities: { mythic: '1%', legendary: '15%', epic: '30%', rare: '54%', common: '0%' },
    color: 'border-gold',
    glow: 'shadow-gold-glow',
    icon: <Trophy className="text-gold" size={40} />
  },
  {
    id: 'mythic',
    name: 'Pack Mítico',
    price: 500,
    currency: 'gems',
    cards: 5,
    probabilities: { mythic: '10%', legendary: '40%', epic: '50%', rare: '0%', common: '0%' },
    color: 'border-mythic',
    glow: 'shadow-mythic-glow',
    icon: <Sparkles className="text-mythic" size={40} />
  }
];

export default function PacksPage() {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenPack = (packName: string) => {
    setIsOpening(true);
    setTimeout(() => {
      setIsOpening(false);
      toast.success(`Você abriu o ${packName}! Verifique seu inventário.`);
    }, 2000);
  };

  return (
    <div className="bg-[#060608] min-h-screen text-white font-outfit pb-40">
      <Header />
      
      <main className="pt-10 lg:pt-40 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
           <div className="space-y-6">
              <h1 className="text-7xl md:text-8xl font-black italic uppercase font-bebas tracking-wider leading-none">
                Loja de <span className="text-primary">Packs</span>
              </h1>
              <p className="text-white/40 text-lg font-bold uppercase tracking-[0.2em] italic max-w-xl">
                 Tente a sorte e obtenha os cards mais raros da Copa 2026. Novos packs toda semana.
              </p>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-3xl border border-white/5">
                 <Coins size={20} className="text-gold" />
                 <span className="text-2xl font-black italic font-bebas">12,500</span>
              </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
           {PACKS.map((pack) => (
             <motion.div 
               key={pack.id}
               whileHover={{ y: -10 }}
               className={cn(
                 "relative group overflow-hidden rounded-[48px] bg-[#0a0a0c] border p-12 transition-all",
                 pack.color,
                 pack.glow
               )}
             >
                {/* Pack Visual */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-10">
                   <div className="w-32 h-40 bg-white/2 rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                      {pack.icon}
                      <Sparkles className="absolute top-4 right-4 text-white/10 animate-pulse" size={20} />
                   </div>

                   <div className="space-y-3">
                      <h3 className="text-4xl font-black italic uppercase font-bebas tracking-widest">{pack.name}</h3>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{pack.cards} CARDS POR PACK</p>
                   </div>

                   <div className="w-full space-y-4 pt-6 border-t border-white/5">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                         <span className="text-white/40 italic">Mítico</span>
                         <span className="text-mythic">{pack.probabilities.mythic}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                         <span className="text-white/40 italic">Lendário</span>
                         <span className="text-gold">{pack.probabilities.legendary}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                         <span className="text-white/40 italic">Épico</span>
                         <span className="text-accent">{pack.probabilities.epic}</span>
                      </div>
                   </div>

                   <button 
                     onClick={() => handleOpenPack(pack.name)}
                     className="w-full py-6 bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl text-xs uppercase tracking-[0.3em] italic transition-all border border-white/10 flex items-center justify-center gap-4 group"
                   >
                      <Coins size={16} className={cn(pack.currency === 'coins' ? "text-gold" : "text-secondary")} />
                      {pack.price} {pack.currency === 'coins' ? 'Coins' : 'Gems'}
                   </button>
                </div>

                {/* Bg Decoration */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/2 rounded-full blur-[100px] pointer-events-none" />
             </motion.div>
           ))}
        </div>
      </main>

      <AnimatePresence>
        {isOpening && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl flex items-center justify-center flex-col gap-12"
          >
             <motion.div
               animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
               }}
               transition={{ duration: 1.5, repeat: Infinity }}
               className="w-48 h-64 bg-primary rounded-3xl flex items-center justify-center shadow-[0_0_100px_rgba(245,158,11,0.5)]"
             >
                <PackageOpen size={80} className="text-black" />
             </motion.div>
             <h2 className="text-4xl font-black italic uppercase font-bebas tracking-widest animate-pulse">Abrindo Pack...</h2>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
