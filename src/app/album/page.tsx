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
import { MOCK_PLAYERS, MOCK_USER_CARDS, MOCK_ALBUMS } from '@/lib/mock-data';
import { StickerCard } from '@/components/game/StickerCard';
import { CardDetailsModal } from '@/components/game/CardDetailsModal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const TEAMS = [
  { id: 'bra', name: 'Brasil', color: 'text-yellow-400', bg: 'bg-yellow-400/5' },
  { id: 'fra', name: 'França', color: 'text-blue-400', bg: 'bg-blue-400/5' },
  { id: 'arg', name: 'Argentina', color: 'text-sky-400', bg: 'bg-sky-400/5' },
  { id: 'esp', name: 'Espanha', color: 'text-red-400', bg: 'bg-red-400/5' },
];

export default function AlbumPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  const handlePasteCard = (playerName: string) => {
    toast.success(`${playerName} colado no álbum com sucesso!`);
  };

  return (
    <div className={cn(
      "min-h-screen text-white font-outfit pb-40 transition-all duration-700 ease-in-out",
      selectedAlbum ? `bg-gradient-to-b ${selectedAlbum.bg_color}` : "bg-[#060608]"
    )}>
      <Header />
      
      <main className="pt-32 md:pt-40 px-4 md:px-8 max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
          {!selectedAlbum ? (
            <motion.div 
              key="shelf"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
                <div className="space-y-4">
                  <h1 className="text-6xl md:text-8xl font-black italic uppercase font-bebas tracking-wider leading-none">
                    Sua <span className="text-primary">Estante</span>
                  </h1>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] italic">Selecione uma coleção temática para completar</p>
                </div>
                <div className="flex gap-4 bg-white/[0.03] px-6 py-4 rounded-xl border border-white/5 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Trophy size={20} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Coleções</span>
                      <span className="text-2xl font-black italic font-bebas tracking-wider text-white">04 ATIVAS</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex overflow-x-auto gap-6 pb-12 pt-4 px-4 no-scrollbar scroll-smooth snap-x">
                  {MOCK_ALBUMS.map((album) => (
                    <motion.div 
                      key={album.id}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => setSelectedAlbum(album)}
                      className="relative group cursor-pointer flex-shrink-0 w-[280px] md:w-[350px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] snap-center shadow-2xl"
                    >
                      <img 
                        src={album.theme_image} 
                        className="absolute inset-0 w-full h-full object-cover opacity-70 lg:opacity-40 group-hover:opacity-60 transition-opacity grayscale-0 lg:grayscale-[50%] group-hover:grayscale-0"
                        alt={album.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      
                      <div className="absolute inset-0 p-8 flex flex-col justify-end gap-4">
                        <div className="space-y-2">
                          <h3 className="text-4xl font-black italic uppercase font-bebas tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{album.name}</h3>
                          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{album.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">PROGRESSO</span>
                             <span className="text-primary font-black italic font-bebas text-xl">12/350</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                             <ChevronRight size={20} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {/* Scroll Indicators/Hints */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                   {MOCK_ALBUMS.map((_, i) => (
                     <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />
                   ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-12"
            >
              <button 
                onClick={() => setSelectedAlbum(null)}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors group italic"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                VOLTAR PARA ESTANTE
              </button>

              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
                 <div className="space-y-6">
                    <h1 className="text-6xl md:text-8xl font-black italic uppercase font-bebas tracking-wider leading-none">
                      {selectedAlbum.name.split(' ')[0]} <span className="text-primary">{selectedAlbum.name.split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                       <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-md border border-white/5 backdrop-blur-md">
                          <CheckCircle2 size={16} className="text-success" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">12/{selectedAlbum.required_cards.length || 350} Coladas</span>
                       </div>
                       <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-md border border-white/5 backdrop-blur-md">
                          <Trophy size={16} className="text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Prêmio: {selectedAlbum.reward_coins} Coins</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* ALBUM VIEW */}
              <div className="relative rounded-3xl p-10 md:p-20 border border-white/10 overflow-hidden backdrop-blur-sm bg-black/20">
                 {/* Page watermark */}
                 <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black italic uppercase font-bebas text-white/[0.03] pointer-events-none select-none whitespace-nowrap">
                    {selectedAlbum.name}
                 </h2>

                 <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
                    {MOCK_PLAYERS.slice(0, 10).map((player) => {
                      const isOwned = MOCK_USER_CARDS.some(c => c.player_id === player.id);
                      
                      return (
                        <div key={player.id} className="space-y-6 flex flex-col items-center group/card">
                          <div className="relative w-full">
                             <StickerCard 
                               player={player} 
                               isOwned={isOwned} 
                               onClick={() => setSelectedPlayer(player)}
                               className={cn("w-full transition-all duration-500", !isOwned && "grayscale opacity-40 scale-90 group-hover/card:scale-95 group-hover/card:opacity-60")}
                             />
                              {!isOwned && (
                                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                                   <Lock size={32} className="text-white/20 group-hover/card:scale-110 transition-transform" />
                                </div>
                              )}
                          </div>
                          
                          {isOwned && (
                             <button 
                               onClick={() => handlePasteCard(player.name)}
                               className="w-full py-3 bg-primary text-black font-black uppercase tracking-widest rounded-sm transition-all italic text-[9px] hover:scale-105"
                             >
                                Colar Agora
                             </button>
                          )}
                        </div>
                      );
                    })}
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
