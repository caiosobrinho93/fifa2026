'use client';

import React, { useState, useMemo } from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { StickerCard } from "@/components/game/StickerCard";
import { CardDetailsModal } from "@/components/game/CardDetailsModal";
import { MOCK_PLAYERS, MOCK_USER_CARDS } from "@/lib/mock-data";
import { Search, Sparkles, Filter, Trash2, Hammer, Info } from "lucide-react";
import { toast } from "sonner";
import { Player, Rarity } from "@/types/game";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeRarity, setActiveRarity] = useState<Rarity | 'all'>('all');
  const [isCraftingMode, setIsCraftingMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const ownedCardsMap = useMemo(() => {
    const map = new Map<string, { quantity: number; is_shiny: boolean }>();
    MOCK_USER_CARDS.forEach(c => map.set(c.player_id, { quantity: c.quantity, is_shiny: c.is_shiny }));
    return map;
  }, []);

  const filteredPlayers = useMemo(() => {
    return MOCK_PLAYERS.filter(p => {
      const matchesRarity = activeRarity === 'all' || p.rarity === activeRarity;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOwned = isCraftingMode ? true : ownedCardsMap.has(p.id);
      return matchesRarity && matchesSearch && matchesOwned;
    });
  }, [activeRarity, searchQuery, isCraftingMode, ownedCardsMap]);

  const duplicatesCount = useMemo(() => {
    return MOCK_USER_CARDS.reduce((acc, c) => acc + (c.quantity > 1 ? c.quantity - 1 : 0), 0);
  }, []);

  const handleMassDisenchant = () => {
    if (duplicatesCount === 0) {
      toast.info("Você não possui cartas repetidas.");
      return;
    }
    toast.success(`Sucesso! ${duplicatesCount} cartas transformadas em 450 Cristais.`);
  };

  return (
    <div className="pb-40 pt-28 px-4 max-w-7xl mx-auto space-y-10 font-jakarta">
      {/* HEARTHSTONE STYLE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center border border-primary/20 shadow-gold-glow">
                <Sparkles className="text-primary" size={32} />
             </div>
             <div>
                <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter font-syne leading-none">MINHA COLEÇÃO</h1>
                <p className="text-xs text-primary font-black uppercase tracking-[0.3em] mt-2">Sua jornada épica rumo ao Hexa</p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
           {/* Search Bar */}
           <div className="relative w-full md:w-80">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text" 
                placeholder="Pesquisar coleção..."
                className="w-full bg-[#0f172a] border border-white/5 rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all text-white shadow-2xl"
              />
           </div>

           {/* Crafting Toggle Button */}
           <button 
             onClick={() => setIsCraftingMode(!isCraftingMode)}
             className={cn(
               "flex items-center gap-3 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest italic transition-all border shadow-xl",
               isCraftingMode 
                ? "bg-secondary text-white border-secondary/50 shadow-secondary/20" 
                : "bg-white/5 text-white/40 border-white/10 hover:text-white"
             )}
           >
              <Hammer size={18} />
              {isCraftingMode ? 'MODO CRIAÇÃO: ATIVO' : 'CRIAR CARTAS'}
           </button>
        </div>
      </div>

      {/* RARITY FILTERS (HEARTHSTONE TABS) */}
      <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar">
         {[
           { id: 'all', label: 'TODAS', color: 'bg-white/5 text-white' },
           { id: 'common', label: 'COMUM', color: 'bg-slate-700/20 text-slate-400 border-slate-700/50' },
           { id: 'rare', label: 'RARA', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
           { id: 'epic', label: 'ÉPICA', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
           { id: 'legendary', label: 'LENDÁRIA', color: 'bg-gold/20 text-gold border-gold/50' },
           { id: 'mythic', label: 'MÍTICA', color: 'bg-red-500/20 text-red-500 border-red-500/50' },
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveRarity(tab.id as any)}
             className={cn(
               "px-8 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap",
               activeRarity === tab.id 
                 ? "bg-primary text-black border-primary shadow-gold-glow scale-105" 
                 : tab.color
             )}
           >
              {tab.label}
           </button>
         ))}
      </div>

      {/* COLLECTION BOOK CONTENT */}
      <div className="relative bg-[#0f172a] rounded-[60px] border border-white/5 p-12 shadow-[0_40px_80px_rgba(0,0,0,0.6)] min-h-[600px]">
         <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
            <Sparkles size={400} />
         </div>

         {filteredPlayers.length > 0 ? (
           <div className="grid card-grid-mobile gap-10">
              <AnimatePresence mode="popLayout">
                {filteredPlayers.map((player) => {
                  const owned = ownedCardsMap.get(player.id);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      key={player.id}
                    >
                      <StickerCard 
                        player={player}
                        isOwned={!!owned}
                        quantity={owned?.quantity}
                        isShiny={owned?.is_shiny}
                        onClick={() => (owned || isCraftingMode) && setSelectedPlayer(player)}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center py-40 text-center space-y-6">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-white/10 border border-white/5">
                 <Search size={48} />
              </div>
              <div>
                 <h3 className="text-2xl font-black italic text-white/20 uppercase">Nenhum resultado</h3>
                 <p className="text-xs text-white/10 font-bold uppercase tracking-widest mt-2">Ajuste seus filtros ou modo de pesquisa</p>
              </div>
           </div>
         )}
      </div>

      {/* HEARTHSTONE STYLE BOTTOM BAR (MASS ACTIONS) */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-40">
         <div className="bg-[#121216]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">COLEÇÃO TOTAL</span>
                  <p className="text-xl font-black italic text-white uppercase">{MOCK_USER_CARDS.length} / {MOCK_PLAYERS.length}</p>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">REPETIDAS</span>
                     <p className={cn("text-xl font-black italic uppercase", duplicatesCount > 0 ? "text-primary" : "text-white/20")}>
                        {duplicatesCount} CARTAS
                     </p>
                  </div>
                  {duplicatesCount > 0 && (
                    <button 
                      onClick={handleMassDisenchant}
                      className="bg-primary/10 hover:bg-primary/20 text-primary p-3 rounded-2xl border border-primary/20 transition-all active:scale-95 group"
                    >
                       <Trash2 size={24} className="group-hover:rotate-12 transition-transform" />
                    </button>
                  )}
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
                  <Info size={16} className="text-secondary" />
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                     {isCraftingMode ? 'Modo Visualização Geral' : 'Mostrando Apenas Sua Coleção'}
                  </span>
               </div>
            </div>
         </div>
      </div>

      <CardDetailsModal 
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        showBuyOption={isCraftingMode && !ownedCardsMap.has(selectedPlayer?.id || '')}
      />

      <Header />
      <BottomNav />
    </div>
  );
}
