'use client';

import React, { useState, useMemo } from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { MOCK_PLAYERS, MOCK_USER_CARDS } from "@/lib/mock-data";
import { Player } from "@/types/game";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Book, Star, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { StickerCard } from '@/components/game/StickerCard';

export default function AlbumPage() {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [pastedCardIds, setPastedCardIds] = useState<Set<string>>(new Set(['1'])); // Mocking some already pasted

  const teams = useMemo(() => {
    const grouped = MOCK_PLAYERS.reduce((acc, player) => {
      if (!acc[player.country]) acc[player.country] = [];
      acc[player.country].push(player);
      return acc;
    }, {} as Record<string, Player[]>);
    
    return Object.entries(grouped).map(([name, players]) => ({ name, players }));
  }, []);

  const currentTeam = teams[activeTeamIndex];
  
  const userOwnedIds = useMemo(() => {
    return new Set(MOCK_USER_CARDS.map(c => c.player_id));
  }, []);

  const handlePaste = (playerId: string) => {
    if (pastedCardIds.has(playerId)) return;
    if (!userOwnedIds.has(playerId)) {
      toast.error("Você não possui esta figurinha no seu inventário!");
      return;
    }

    // In a real app, we would update Supabase here
    setPastedCardIds(prev => new Set([...prev, playerId]));
    toast.success("Figurinha colada com sucesso!", {
      icon: <CheckCircle2 className="text-success" />
    });
  };

  return (
    <div className="pb-40 pt-28 px-4 max-w-7xl mx-auto space-y-12 font-jakarta">
      {/* Album Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-black italic text-white uppercase tracking-normal font-bebas leading-none">ÁLBUM DE FIGURINHAS</h1>
          <p className="text-xs text-primary font-black uppercase tracking-[0.4em]">Coleção Oficial FIFA World Cup 2026</p>
        </div>
        
        <div className="flex items-center gap-4 bg-[#0f172a] p-2 rounded-full border border-white/5 shadow-2xl">
           <button 
             onClick={() => setActiveTeamIndex(p => Math.max(0, p - 1))}
             disabled={activeTeamIndex === 0}
             className="p-3 bg-white/5 hover:bg-white/10 rounded-full disabled:opacity-20 transition-all active:scale-90"
           >
              <ChevronLeft size={20} />
           </button>
           <div className="px-6 text-center">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block">EQUIPE ATUAL</span>
              <span className="text-lg font-black text-white italic font-bebas uppercase tracking-wider">{currentTeam?.name}</span>
           </div>
           <button 
             onClick={() => setActiveTeamIndex(p => Math.min(teams.length - 1, p + 1))}
             disabled={activeTeamIndex === teams.length - 1}
             className="p-3 bg-white/5 hover:bg-white/10 rounded-full disabled:opacity-20 transition-all active:scale-90"
           >
              <ChevronRight size={20} />
           </button>
        </div>
      </div>

      {/* PHYSICAL ALBUM VIEW */}
      <div className="relative">
         {/* The "Paper" Page Effect */}
         <div className="bg-[#0f172a] rounded-[60px] border-l-[12px] border-primary border border-white/5 p-12 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden min-h-[700px]">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-5 pointer-events-none" />
            
            {/* Page Header */}
            <div className="relative z-10 flex items-center justify-between mb-16">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-14 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
                     {/* Flag Placeholder */}
                     <img 
                        src={`https://flagcdn.com/w80/${currentTeam?.name === 'Brasil' ? 'br' : 'fr'}.png`} 
                        alt={currentTeam?.name}
                        className="w-12 h-auto rounded shadow-lg"
                     />
                  </div>
                  <div>
                     <h2 className="text-5xl font-black italic text-white uppercase font-bebas tracking-wider leading-none">
                        {currentTeam?.name}
                     </h2>
                     <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-1">Conclua a página para ganhar recompensas</p>
                  </div>
               </div>
               
               <div className="text-right">
                  <span className="text-4xl font-black text-primary italic font-bebas">
                    {Math.round((currentTeam?.players.filter(p => pastedCardIds.has(p.id)).length / currentTeam?.players.length) * 100)}%
                  </span>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">COMPLETADO</p>
               </div>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 relative z-10">
               {currentTeam?.players.map((player) => {
                 const isPasted = pastedCardIds.has(player.id);
                 const canPaste = userOwnedIds.has(player.id) && !isPasted;

                 return (
                   <div key={player.id} className="space-y-4 group">
                      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden">
                         {isPasted ? (
                           <motion.div
                             initial={{ scale: 0.8, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             className="w-full h-full"
                           >
                             <StickerCard player={player} isOwned={true} />
                           </motion.div>
                         ) : (
                           <div className="w-full h-full bg-black/40 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-4 transition-all group-hover:border-primary/30">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/10 mb-3">
                                 {userOwnedIds.has(player.id) ? <CheckCircle2 className="text-primary" /> : <Lock size={16} />}
                              </div>
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-tight">
                                 {player.name}
                              </span>
                              <span className="text-[10px] font-black text-white/10 mt-1 italic font-bebas">RANK #{player.id}</span>
                           </div>
                         )}
                      </div>
                      
                      {canPaste && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePaste(player.id)}
                          className="w-full py-3 bg-primary text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-gold-glow animate-pulse"
                        >
                           COLAR FIGURINHA
                        </motion.button>
                      )}

                      {!isPasted && !canPaste && (
                        <div className="w-full py-3 bg-white/5 text-white/20 font-black text-[8px] uppercase tracking-[0.2em] rounded-xl border border-white/5 text-center">
                           NÃO OBTIDA
                        </div>
                      )}

                      {isPasted && (
                        <div className="w-full py-3 bg-success/10 text-success font-black text-[8px] uppercase tracking-[0.2em] rounded-xl border border-success/20 text-center flex items-center justify-center gap-2">
                           <CheckCircle2 size={10} />
                           COLADA
                        </div>
                      )}
                   </div>
                 );
               })}
            </div>
         </div>

         {/* Navigation Pills */}
         <div className="flex justify-center gap-2 mt-12 flex-wrap">
            {teams.map((team, idx) => (
              <button
                key={team.name}
                onClick={() => setActiveTeamIndex(idx)}
                className={cn(
                  "px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all",
                  activeTeamIndex === idx 
                    ? "bg-primary text-black shadow-gold-glow scale-110" 
                    : "bg-[#0f172a] text-white/40 hover:text-white border border-white/5"
                )}
              >
                {team.name}
              </button>
            ))}
         </div>
      </div>

      <Header />
      <BottomNav />
    </div>
  );
}
