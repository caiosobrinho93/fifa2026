'use client';

import React from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { MOCK_PLAYERS } from "@/lib/mock-data";
import { StickerCard } from "@/components/game/StickerCard";
import { CardDetailsModal } from "@/components/game/CardDetailsModal";
import { Search, SlidersHorizontal, TrendingUp } from "lucide-react";
import { Player } from "@/types/game";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function MarketplacePage() {
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);

  const handleBuy = (playerName: string) => {
    toast.success("Compra realizada!", {
      description: `Você adquiriu ${playerName} com sucesso.`,
    });
    setSelectedPlayer(null);
  };

  return (
    <div className="bg-background min-h-screen text-white font-outfit selection:bg-primary/30">
      <Header />
      
      <main className="pb-40 pt-32 md:pt-40 px-4 md:px-8 max-w-[1600px] mx-auto space-y-12">
        <CardDetailsModal 
          player={selectedPlayer}
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onBuy={() => selectedPlayer && handleBuy(selectedPlayer.name)}
          showBuyOption={true}
        />
        
        {/* TITULO PADRONIZADO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16"
        >
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black italic uppercase font-bebas tracking-wider leading-none">
              Mercado <span className="text-primary">Live</span>
            </h1>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] italic">Negocie ativos digitais com colecionadores globais</p>
          </div>
          <div className="flex gap-4 bg-white/[0.03] px-6 py-4 rounded-xl border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center border border-success/20">
                <TrendingUp size={20} className="text-success" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Volume 24h</span>
                <span className="text-2xl font-black italic font-bebas tracking-wider text-white">1.2M COINS</span>
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
              placeholder="BUSCAR JOGADOR, SELEÇÃO OU RARIDADE..."
              className="w-full bg-white/[0.02] border border-white/5 rounded-sm py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all shadow-xl text-white placeholder:text-white/20"
            />
          </div>
          <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white/[0.02] rounded-sm text-white/60 hover:text-white transition-all border border-white/5 font-black text-[10px] uppercase tracking-widest shadow-xl italic">
            <SlidersHorizontal size={16} />
            FILTROS
          </button>
        </div>

        {/* Lista de Itens do Mercado */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
          {MOCK_PLAYERS.map((player) => (
            <StickerCard 
              key={player.id} 
              player={player} 
              onClick={() => setSelectedPlayer(player)}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
