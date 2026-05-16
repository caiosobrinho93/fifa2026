'use client';

import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Search, 
  Filter, 
  ChevronDown,
  Sparkles,
  ArrowUpDown
} from "lucide-react";
import { MOCK_PLAYERS, MOCK_USER_CARDS } from '@/lib/mock-data';
import { StickerCard } from '@/components/game/StickerCard';
import { cn } from '@/lib/utils';

export default function InventoryPage() {
  const [filter, setFilter] = useState('all');

  // Filter players that are in user's cards
  const userOwnedPlayers = MOCK_PLAYERS.filter(player => 
    MOCK_USER_CARDS.some(c => c.player_id === player.id)
  );

  return (
    <div className="bg-[#060608] min-h-screen text-white font-outfit pb-40">
      <Header />
      
      <main className="pt-10 lg:pt-40 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
           <div className="space-y-6">
              <h1 className="text-7xl md:text-8xl font-black italic uppercase font-bebas tracking-wider leading-none">
                Meu <span className="text-primary">Inventário</span>
              </h1>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                    <LayoutDashboard size={16} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{userOwnedPlayers.length} Cards Únicos</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                 <input 
                   type="text" 
                   placeholder="BUSCAR JOGADOR..." 
                   className="w-full md:w-72 bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:border-primary/50 transition-all outline-none"
                 />
              </div>
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-white/40 hover:text-primary">
                 <Filter size={20} />
              </button>
           </div>
        </div>

        {/* GRID SECTION */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
           {userOwnedPlayers.map((player) => {
             const userCard = MOCK_USER_CARDS.find(c => c.player_id === player.id);
             return (
               <motion.div 
                 key={player.id}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.3 }}
               >
                 <StickerCard 
                   player={player} 
                   isOwned={true} 
                   quantity={userCard?.quantity}
                   isGolden={userCard?.is_golden}
                   isShiny={userCard?.is_shiny}
                 />
               </motion.div>
             );
           })}

           {/* Empty inventory state if no cards */}
           {userOwnedPlayers.length === 0 && (
             <div className="col-span-full py-40 text-center space-y-8">
                <div className="w-24 h-24 bg-white/2 rounded-full flex items-center justify-center mx-auto border border-white/5">
                   <LayoutDashboard size={40} className="text-white/10" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-3xl font-black italic uppercase font-bebas tracking-widest text-white/20">Inventário Vazio</h3>
                   <p className="text-white/10 text-xs font-bold uppercase tracking-widest">Abra packs para começar sua coleção</p>
                </div>
             </div>
           )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
