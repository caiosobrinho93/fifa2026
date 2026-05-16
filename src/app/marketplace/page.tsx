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
    <div className="pb-32 pt-24 px-4 max-w-7xl mx-auto space-y-8">
      <CardDetailsModal 
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onBuy={() => selectedPlayer && handleBuy(selectedPlayer.name)}
        showBuyOption={true}
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic text-white">MERCADO</h1>
          <p className="text-xs text-primary font-black uppercase tracking-widest mt-1">Negocie com colecionadores globais</p>
        </div>
        <div className="flex gap-4 bg-[#0f172a] px-6 py-4 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-success" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/30 uppercase">Volume 24h</span>
              <span className="text-xs font-black text-white">1.2M Coins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input 
            type="text" 
            placeholder="Buscar jogador, seleção ou raridade..."
            className="w-full bg-[#0f172a] border border-white/5 rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all shadow-xl text-white placeholder:text-white/20"
          />
        </div>
        <button className="flex items-center justify-center gap-3 px-8 py-4 bg-[#0f172a] rounded-full text-white/60 hover:text-white transition-all border border-white/5 font-black text-xs uppercase tracking-widest shadow-xl">
          <SlidersHorizontal size={18} />
          Filtros
        </button>
      </div>

      {/* Market Trends */}
      <div className="bg-[#0f172a] rounded-[40px] p-8 border border-white/5 bg-gradient-to-br from-primary/5 to-transparent shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-success/10 rounded-2xl border border-success/10">
            <TrendingUp size={24} className="text-success" />
          </div>
          <h3 className="text-lg font-black italic uppercase tracking-widest text-white">Tendências de Valorização</h3>
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
          {[
            { name: 'Vinícius Júnior', change: '+12.4%', color: 'text-success', rarity: 'legendary' },
            { name: 'Kylian Mbappé', change: '+5.2%', color: 'text-success', rarity: 'legendary' },
            { name: 'Lionel Messi', change: '-1.8%', color: 'text-danger', rarity: 'mythic' },
            { name: 'Lamine Yamal', change: '+24.1%', color: 'text-success', rarity: 'rare' },
          ].map((trend) => (
            <motion.div 
              key={trend.name} 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col gap-2 min-w-[200px] bg-black/40 p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all shadow-xl"
            >
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{trend.rarity}</span>
              <span className="text-base font-black truncate italic text-white">{trend.name}</span>
              <span className={cn("text-sm font-black italic", trend.color)}>{trend.change}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Market Items */}
      <div className="grid card-grid-mobile gap-6 md:gap-10">
        {MOCK_PLAYERS.map((player) => (
          <StickerCard 
            key={player.id} 
            player={player} 
            onClick={() => setSelectedPlayer(player)}
          />
        ))}
      </div>

      <Header />
      <BottomNav />
    </div>
  );
}
