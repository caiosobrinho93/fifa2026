'use client';

import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Users
} from "lucide-react";
import { MOCK_PLAYERS, MOCK_USER_CARDS } from '@/lib/mock-data';
import { StickerCard } from '@/components/game/StickerCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const TEAMS = [
  { id: 'bra', name: 'Brasil', color: 'text-yellow-400', bg: 'bg-yellow-400/5' },
  { id: 'fra', name: 'França', color: 'text-blue-400', bg: 'bg-blue-400/5' },
  { id: 'arg', name: 'Argentina', color: 'text-sky-400', bg: 'bg-sky-400/5' },
  { id: 'esp', name: 'Espanha', color: 'text-red-400', bg: 'bg-red-400/5' },
];

export default function AlbumPage() {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const activeTeam = TEAMS[activeTeamIndex];
  
  // Filter players for active team (mock logic)
  const teamPlayers = MOCK_PLAYERS.filter(p => p.country === activeTeam.name);

  const handlePasteCard = (playerName: string) => {
    toast.success(`${playerName} colado no álbum com sucesso!`);
  };

  return (
    <div className="bg-[#060608] min-h-screen text-white font-outfit pb-40">
      <Header />
      
      <main className="pt-10 lg:pt-40 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
           <div className="space-y-6">
              <h1 className="text-7xl md:text-8xl font-black italic uppercase font-bebas tracking-wider leading-none">
                Álbum <span className="text-primary">Oficial</span>
              </h1>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                    <CheckCircle2 size={16} className="text-success" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">12/350 Coladas</span>
                 </div>
                 <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                    <Users size={16} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">24 Seleções</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTeamIndex(prev => Math.max(0, prev - 1))}
                className="p-5 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 transition-all disabled:opacity-20"
                disabled={activeTeamIndex === 0}
              >
                 <ChevronLeft size={24} />
              </button>
              <div className="px-10 py-5 bg-primary text-black font-black rounded-3xl text-xs uppercase tracking-[0.3em] italic shadow-gold-glow min-w-[200px] text-center">
                 {activeTeam.name}
              </div>
              <button 
                onClick={() => setActiveTeamIndex(prev => Math.min(TEAMS.length - 1, prev + 1))}
                className="p-5 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 transition-all disabled:opacity-20"
                disabled={activeTeamIndex === TEAMS.length - 1}
              >
                 <ChevronRight size={24} />
              </button>
           </div>
        </div>

        {/* ALBUM PAGE GRID */}
        <div className={cn(
          "relative rounded-[48px] p-10 md:p-20 border border-white/5 overflow-hidden transition-colors duration-500",
          activeTeam.bg
        )}>
           {/* Page watermark */}
           <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black italic uppercase font-bebas text-white/[0.02] pointer-events-none select-none">
              {activeTeam.id}
           </h2>

           <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {teamPlayers.map((player) => {
                const isOwned = MOCK_USER_CARDS.some(c => c.player_id === player.id);
                
                return (
                  <div key={player.id} className="space-y-6 flex flex-col items-center">
                    <div className="relative">
                       <StickerCard 
                         player={player} 
                         isOwned={isOwned} 
                         className={cn("w-full transition-all", !isOwned && "scale-95")}
                       />
                       {!isOwned && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-[24px] z-50">
                            <Lock size={32} className="text-white/20" />
                         </div>
                       )}
                    </div>
                    
                    {isOwned && (
                       <button 
                         onClick={() => handlePasteCard(player.name)}
                         className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all italic text-primary"
                       >
                          Colar no Álbum
                       </button>
                    )}
                  </div>
                );
              })}
              
              {/* Empty Slots */}
              {Array.from({ length: 4 - teamPlayers.length }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-[2/3] rounded-[24px] bg-black/20 border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-8 text-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <Sparkles size={20} className="text-white/10" />
                   </div>
                   <span className="text-[9px] font-black text-white/10 uppercase tracking-widest italic">Slot #{10 + i} <br /> Aguardando Card</span>
                </div>
              ))}
           </div>
        </div>

        {/* PAGE INDICATOR */}
        <div className="flex justify-center gap-3 mt-12">
           {TEAMS.map((_, i) => (
             <div 
               key={i} 
               className={cn(
                 "h-1.5 rounded-full transition-all duration-500",
                 i === activeTeamIndex ? "w-12 bg-primary shadow-gold-glow" : "w-3 bg-white/10"
               )}
             />
           ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
