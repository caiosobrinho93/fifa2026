'use client';

import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Coins, 
  Gem, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { PackOpener } from '@/components/game/PackOpener';
import { Player, Pack } from '@/types/game';
import { MOCK_PLAYERS } from '@/lib/mock-data';

interface PackConfig {
  id: string;
  name: string;
  price: number;
  currency: 'coins' | 'gems';
  cards: number;
  probabilities: { common: string; rare: string; epic: string; legendary: string };
  bgImage: string;
  accentColor: string;
}

const PACKS: PackConfig[] = [
  {
    id: 'iniciante',
    name: 'Pack Iniciante',
    price: 500,
    currency: 'coins',
    cards: 3,
    probabilities: { common: '60%', rare: '25%', epic: '10%', legendary: '5%' },
    bgImage: '/packs/iniciante.png',
    accentColor: '#64748b'
  },
  {
    id: 'raro',
    name: 'Pack Raro',
    price: 1500,
    currency: 'coins',
    cards: 5,
    probabilities: { common: '30%', rare: '40%', epic: '20%', legendary: '10%' },
    bgImage: '/packs/raro.png',
    accentColor: '#3b82f6'
  },
  {
    id: 'epico',
    name: 'Pack Épico',
    price: 3500,
    currency: 'coins',
    cards: 5,
    probabilities: { common: '0%', rare: '30%', epic: '40%', legendary: '30%' },
    bgImage: '/packs/epico.png',
    accentColor: '#a855f7'
  },
  {
    id: 'lendario',
    name: 'Pack Lendário',
    price: 750,
    currency: 'gems',
    cards: 7,
    probabilities: { common: '0%', rare: '0%', epic: '50%', legendary: '50%' },
    bgImage: '/packs/lendario.png',
    accentColor: '#fbbf24'
  }
];

const getRandomCards = (count: number): Player[] => {
  const weights: Record<string, number> = {
    common: 60,
    rare: 25,
    epic: 10,
    legendary: 5
  };

  const cards: Player[] = [];
  
  for (let i = 0; i < count; i++) {
    const rand = Math.random() * 100;
    let rarity: string = 'common';
    
    let cumulative = 0;
    for (const [r, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (rand <= cumulative) {
        rarity = r;
        break;
      }
    }
    
    const filtered = MOCK_PLAYERS.filter(p => p.rarity === rarity);
    const player = filtered.length > 0 
      ? filtered[Math.floor(Math.random() * filtered.length)]
      : MOCK_PLAYERS[Math.floor(Math.random() * MOCK_PLAYERS.length)];
    
    cards.push(player);
  }
  
  return cards;
};

export default function PacksPage() {
  const [selectedPack, setSelectedPack] = useState<PackConfig | null>(null);
  const [openedCards, setOpenedCards] = useState<Player[]>([]);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenPack = (pack: PackConfig) => {
    if (pack.price > 12500 && pack.currency === 'coins') {
      toast.error("Moedas insuficientes!");
      return;
    }
    
    setSelectedPack(pack);
    setIsOpening(true);
    
    setTimeout(() => {
      const cards = getRandomCards(pack.cards);
      setOpenedCards(cards);
    }, 1500);
  };

  const handleClosePackOpener = () => {
    setIsOpening(false);
    setSelectedPack(null);
    setOpenedCards([]);
    toast.success("Cards adicionados ao seu inventário!");
  };

  const getRarityLabel = (rarity: string) => {
    switch(rarity) {
      case 'legendary': return 'Lendário';
      case 'epic': return 'Épico';
      case 'rare': return 'Raro';
      case 'common': return 'Comum';
      default: return rarity;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'legendary': return 'text-amber-400';
      case 'epic': return 'text-purple-400';
      case 'rare': return 'text-blue-400';
      case 'common': return 'text-slate-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="bg-background min-h-screen text-white font-outfit pb-40">
      <Header />
      
      <main className="pt-32 md:pt-40 px-4 md:px-8 max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16"
        >
           <div className="space-y-4">
               <h1 className="text-6xl md:text-7xl font-black italic uppercase font-bebas tracking-wider leading-none">
                 Pack <span className="text-primary">Collection</span>
               </h1>
               <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] italic">
                 Abra e descubra cartas exclusivas no mercado live
               </p>
           </div>
           
           <div className="flex items-center gap-4 bg-white/[0.03] px-6 py-4 rounded-xl border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Coins size={20} className="text-amber-400" />
                 </div>
                 <span className="text-2xl font-black italic font-bebas tracking-wider text-amber-400">12.500</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Gem size={20} className="text-purple-400" />
                 </div>
                 <span className="text-2xl font-black italic font-bebas tracking-wider text-purple-400">450</span>
              </div>
           </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           {PACKS.map((pack, index) => (
             <motion.div 
                key={pack.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative group overflow-hidden rounded-2xl aspect-[3/4]"
             >
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${pack.bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                <div className="absolute inset-0 flex items-end p-6">
                   <div className="w-full space-y-4">
                      <div>
                        <h3 className="text-3xl font-black italic uppercase font-bebas tracking-wider mb-1 drop-shadow-lg">{pack.name}</h3>
                        <div className="flex items-center gap-2">
                          {Array.from({ length: pack.cards }).map((_, i) => (
                            <div key={i} className="w-4 h-6 bg-white/30 rounded-sm backdrop-blur-sm" />
                          ))}
                          <span className="text-[10px] font-bold text-white/70 ml-2 uppercase">{pack.cards} Cards</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {Object.entries(pack.probabilities).map(([rarity, value]) => (
                          value !== '0%' && (
                            <div key={rarity} className="flex justify-between items-center">
                               <span className={cn("text-[9px] font-bold uppercase tracking-widest", getRarityColor(rarity))}>
                                 {getRarityLabel(rarity)}
                               </span>
                               <span className="text-[11px] font-black text-white/60 italic">{value}</span>
                            </div>
                          )
                        ))}
                      </div>

                      <button 
                        onClick={() => handleOpenPack(pack)}
                        className={cn(
                          "w-full py-3 px-4 rounded-xl font-black text-sm uppercase tracking-[0.15em] italic transition-all duration-300 flex items-center justify-center gap-2",
                          pack.currency === 'gems' 
                            ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30"
                            : "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white shadow-lg shadow-primary/30"
                        )}
                      >
                        {pack.currency === 'gems' ? <Gem size={16} /> : <Coins size={16} />}
                        <span>{pack.price}</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>

                <div className="absolute top-4 right-4">
                  <Sparkles className="text-white/50 animate-pulse" size={24} />
                </div>
             </motion.div>
           ))}
        </div>
      </main>

      <AnimatePresence>
        {isOpening && selectedPack && (
          <PackOpener 
            pack={{
              id: selectedPack.id,
              name: selectedPack.name,
              description: '',
              price_coins: selectedPack.currency === 'coins' ? selectedPack.price : 0,
              price_gems: selectedPack.currency === 'gems' ? selectedPack.price : 0,
              card_count: selectedPack.cards,
              probabilities: {
                common: parseFloat(selectedPack.probabilities.common) / 100,
                rare: parseFloat(selectedPack.probabilities.rare) / 100,
                epic: parseFloat(selectedPack.probabilities.epic) / 100,
                legendary: parseFloat(selectedPack.probabilities.legendary) / 100
              },
              rarity: selectedPack.id === 'lendario' ? 'legendary' : 
                     selectedPack.id === 'epico' ? 'epic' : 
                     selectedPack.id === 'raro' ? 'rare' : 'common'
            }}
            cards={openedCards.length > 0 ? openedCards : getRandomCards(selectedPack.cards)}
            onClose={handleClosePackOpener}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}