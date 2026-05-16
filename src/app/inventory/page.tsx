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
import { CardDetailsModal } from '@/components/game/CardDetailsModal';
import { cn } from '@/lib/utils';
import { Player } from '@/types/game';
import { useInventory } from '@/contexts/InventoryContext';

export default function InventoryPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { userCards, isLoading } = useInventory();

  // Filter players that are in user's cards
  const userOwnedPlayers = MOCK_PLAYERS.filter(player => userCards[player.id] > 0);

  return (
    <div className="bg-background min-h-screen text-white font-outfit selection:bg-primary/30">
      <Header />
      
      <main className="pb-40 pt-32 md:pt-40 px-4 md:px-8 max-w-[1600px] mx-auto space-y-12">
        {/* TITULO PADRONIZADO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16"
        >
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black italic uppercase font-bebas tracking-wider leading-none">
              Sua <span className="text-primary">Coleção</span>
            </h1>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] italic">Gerencie sua coleção de ativos digitais exclusivos</p>
          </div>
          <div className="flex gap-4 bg-white/[0.03] px-6 py-4 rounded-xl border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <LayoutDashboard size={20} className="text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Total de Cards</span>
                <span className="text-2xl font-black italic font-bebas tracking-wider text-white uppercase">{userOwnedPlayers.length} ÚNICOS</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Busca e Filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" 
              placeholder="BUSCAR EM SUA COLEÇÃO..."
              className="w-full bg-white/[0.02] border border-white/5 rounded-sm py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all shadow-xl text-white placeholder:text-white/20"
            />
          </div>
          <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white/[0.02] rounded-sm text-white/60 hover:text-white transition-all border border-white/5 font-black text-[10px] uppercase tracking-widest shadow-xl italic">
            <Filter size={16} />
            FILTRAR
          </button>
        </div>

        {/* GRID SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
           {userOwnedPlayers.map((player) => {
             const quantity = userCards[player.id];
             return (
               <motion.div 
                 key={player.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
               >
                 <StickerCard 
                   player={player} 
                   isOwned={true} 
                   quantity={quantity}
                   onClick={() => setSelectedPlayer(player)}
                 />
               </motion.div>
             );
           })}

           {/* Empty inventory state if no cards */}
           {userOwnedPlayers.length === 0 && (
             <div className="col-span-full py-40 text-center space-y-8">
                <div className="w-24 h-24 bg-white/[0.02] rounded-sm flex items-center justify-center mx-auto border border-white/5">
                   <LayoutDashboard size={40} className="text-white/10" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-3xl font-black italic uppercase font-bebas tracking-widest text-white/20">Inventário Vazio</h3>
                   <p className="text-white/10 text-[10px] font-black uppercase tracking-[0.3em]">Abra packs para começar sua coleção</p>
                </div>
             </div>
           )}
        </div>
      </main>

      <BottomNav />

      <CardDetailsModal 
        player={selectedPlayer} 
        isOpen={!!selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
      />
    </div>
  );
}
