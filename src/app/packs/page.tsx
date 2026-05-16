'use client';

import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { PackOpener } from "@/components/game/PackOpener";
import { MOCK_PLAYERS } from "@/lib/mock-data";
import { Pack } from "@/types/game";
import { motion } from 'framer-motion';
import { Sparkles, Coins, Gem, PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_PACKS: (Pack & { image: string })[] = [
  {
    id: 'p1',
    name: 'Pack Inicial',
    description: 'Contém 3 cartas comuns ou raras.',
    price_coins: 0,
    price_gems: 0,
    card_count: 3,
    probabilities: { common: 0.9, rare: 0.1, epic: 0, legendary: 0, mythic: 0 },
    rarity: 'common',
    image: '/pack_basic_2026_1778931411477.png'
  },
  {
    id: 'p2',
    name: 'Pack Seleção',
    description: '5 cartas com chance de épicas.',
    price_coins: 500,
    price_gems: 0,
    card_count: 5,
    probabilities: { common: 0.7, rare: 0.2, epic: 0.1, legendary: 0, mythic: 0 },
    rarity: 'rare',
    image: '/pack_selection_2026_1778931428395.png'
  },
  {
    id: 'p3',
    name: 'Pack Elite',
    description: 'Lendária garantida!',
    price_coins: 0,
    price_gems: 250,
    card_count: 5,
    probabilities: { common: 0, rare: 0.4, epic: 0.4, legendary: 0.2, mythic: 0 },
    rarity: 'legendary',
    image: '/pack_legendary_2026_1778931445711.png'
  }
];

export default function PacksPage() {
  const [activePack, setActivePack] = useState<Pack | null>(null);
  const [openingCards, setOpeningCards] = useState<any[]>([]);

  const handleOpenPack = (pack: Pack) => {
    const generatedCards = Array.from({ length: pack.card_count }).map(() => {
      return MOCK_PLAYERS[Math.floor(Math.random() * MOCK_PLAYERS.length)];
    });
    
    setOpeningCards(generatedCards);
    setActivePack(pack);
  };

  return (
    <div className="pb-40 pt-28 px-4 max-w-7xl mx-auto space-y-16 font-jakarta">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-6xl font-black italic text-white uppercase tracking-wider font-bebas leading-none">LOJA DE PACKS</h1>
          <p className="text-xs text-primary font-black uppercase tracking-[0.4em] mt-3">Expanda sua coleção oficial 2026</p>
        </div>
        <div className="bg-[#0f172a] px-8 py-4 rounded-[28px] border border-white/5 flex items-center gap-6 shadow-2xl">
           <div className="flex items-center gap-3">
              <Coins size={20} className="text-gold" />
              <span className="text-xl font-black text-white italic font-bebas">12.450</span>
           </div>
           <div className="w-px h-6 bg-white/10" />
           <div className="flex items-center gap-3">
              <Gem size={20} className="text-secondary" />
              <span className="text-xl font-black text-white italic font-bebas">450</span>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {MOCK_PACKS.map((pack) => (
          <motion.div 
            key={pack.id}
            whileHover={{ y: -12, scale: 1.02 }}
            className={cn(
              "bg-[#0f172a] rounded-[50px] p-12 border border-white/5 relative overflow-hidden flex flex-col items-center text-center transition-all duration-500 shadow-[0_32px_64px_rgba(0,0,0,0.5)] group",
              pack.rarity === 'legendary' ? "border-gold/30 ring-1 ring-gold/20" : ""
            )}
          >
            {pack.rarity === 'legendary' && (
              <div className="absolute top-10 right-10 p-3 bg-gold text-black rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] z-20">
                <Sparkles size={24} />
              </div>
            )}
            
            <div className="relative mb-12 w-full aspect-square flex items-center justify-center">
               <div className={cn(
                 "absolute inset-0 blur-[80px] opacity-20 rounded-full scale-75 transition-transform duration-700 group-hover:scale-100",
                 pack.rarity === 'legendary' ? "bg-gold" : "bg-primary"
               )} />
               
               <img 
                 src={pack.image} 
                 alt={pack.name} 
                 className="relative z-10 w-full h-full object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-500" 
               />
            </div>

            <div className="space-y-4 mb-12 w-full">
              <h3 className="text-3xl font-black italic uppercase tracking-wider text-white font-bebas leading-none">{pack.name}</h3>
              <p className="text-xs text-white/40 font-bold leading-relaxed px-8">{pack.description}</p>
            </div>

            <div className="w-full flex flex-col gap-6 mt-auto">
              <div className="flex items-center justify-center gap-8 py-5 bg-black/40 rounded-[32px] border border-white/5 shadow-inner">
                {pack.price_coins > 0 && (
                  <div className="flex items-center gap-3">
                    <Coins size={22} className="text-gold" />
                    <span className="text-2xl font-black text-white italic font-bebas">{pack.price_coins}</span>
                  </div>
                )}
                {pack.price_gems > 0 && (
                  <div className="flex items-center gap-3">
                    <Gem size={22} className="text-secondary" />
                    <span className="text-2xl font-black text-white italic font-bebas">{pack.price_gems}</span>
                  </div>
                )}
                {pack.price_coins === 0 && pack.price_gems === 0 && (
                  <span className="text-sm font-black text-success tracking-[0.3em] uppercase italic">Pack Gratuito</span>
                )}
              </div>

              <button 
                onClick={() => handleOpenPack(pack)}
                className={cn(
                  "w-full py-6 rounded-[32px] font-black text-xs transition-all active:scale-95 shadow-2xl uppercase tracking-[0.3em] italic",
                  pack.rarity === 'legendary' ? "bg-gold text-black hover:bg-gold/90 shadow-gold/20" : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                )}
              >
                Adquirir Agora
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {activePack && (
        <PackOpener 
          pack={activePack} 
          cards={openingCards} 
          onClose={() => setActivePack(null)} 
        />
      )}

      <Header />
      <BottomNav />
    </div>
  );
}
