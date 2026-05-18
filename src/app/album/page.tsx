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
import { MOCK_PLAYERS, MOCK_ALBUMS } from '@/lib/mock-data';
import { StickerCard } from '@/components/game/StickerCard';
import { CardDetailsModal } from '@/components/game/CardDetailsModal';
import { StickerPasteAnimation } from '@/components/game/StickerPasteAnimation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useInventory } from '@/contexts/InventoryContext';

const TEAMS = [
  { id: 'bra', name: 'Brasil', color: 'text-yellow-400', bg: 'bg-yellow-400/5' },
  { id: 'fra', name: 'França', color: 'text-blue-400', bg: 'bg-blue-400/5' },
  { id: 'arg', name: 'Argentina', color: 'text-sky-400', bg: 'bg-sky-400/5' },
  { id: 'esp', name: 'Espanha', color: 'text-red-400', bg: 'bg-red-400/5' },
];

export default function AlbumPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [pasteAnim, setPasteAnim] = useState<{ visible: boolean; name: string; cardId: string }>({ visible: false, name: '', cardId: '' });
  const { userCards, pastedCards, pasteCard } = useInventory();

  const handlePasteCard = (playerName: string, cardId: string) => {
    setPasteAnim({ visible: true, name: playerName, cardId });
  };

  // Calcula progresso real do álbum baseado no inventário
  const getAlbumProgress = (album: typeof MOCK_ALBUMS[0]) => {
    if (album.required_cards.length === 0) return { owned: 0, total: MOCK_PLAYERS.length };
    const owned = album.required_cards.filter(cardId => pastedCards[cardId]).length;
    return { owned, total: album.required_cards.length };
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
                      
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="mb-auto">
                           <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 mb-4">
                              <BookOpen size={24} className="text-white" />
                           </div>
                        </div>
                        
                        <h3 className="text-3xl font-black italic uppercase font-bebas tracking-wider mb-2">{album.name}</h3>
                        
                        <div className="flex items-center justify-between">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Progresso</span>
                              {(() => { const p = getAlbumProgress(album); return <span className="text-sm font-bold">{p.owned}/{p.total} Cards</span>; })()}
                           </div>
                           <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                             <ChevronRight size={20} />
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="album-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* ALBUM HEADER */}
              <div className="flex items-center justify-between bg-black/40 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/10 sticky top-24 z-50">
                 <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setSelectedAlbum(null)}
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                       <ChevronLeft size={24} />
                    </button>
                    <div>
                       <h2 className="text-2xl md:text-4xl font-black italic uppercase font-bebas tracking-wider leading-none">
                          {selectedAlbum.name}
                       </h2>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">
                          Complete a coleção
                       </p>
                    </div>
                 </div>

                 <div className="hidden md:flex items-center gap-6">
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Recompensa</span>
                       <span className="text-lg font-black italic text-primary flex items-center gap-2">
                          <Trophy size={16} />
                          {selectedAlbum.reward_coins} Coins
                       </span>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Coladas</span>
                       {(() => { const p = getAlbumProgress(selectedAlbum); return <span className="text-lg font-black italic">{p.owned}/{p.total}</span>; })()}
                    </div>
                 </div>
              </div>

              {/* ALBUM HERO INFO (Mobile) */}
              <div className="md:hidden bg-white/[0.02] rounded-3xl p-6 border border-white/5 flex flex-col gap-4 relative overflow-hidden">
                 <img src={selectedAlbum.theme_image} className="absolute inset-0 w-full h-full object-cover opacity-10" />
                 <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
                 
                 <div className="relative z-10 space-y-4">
                    <p className="text-sm font-medium text-white/60 leading-relaxed max-w-sm">
                       {selectedAlbum.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                       <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-md border border-white/5 backdrop-blur-md">
                          <CheckCircle2 size={16} className="text-success" />
                          {(() => { const p = getAlbumProgress(selectedAlbum); return <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{p.owned}/{p.total} Coladas</span>; })()}
                       </div>
                    </div>
                 </div>
              </div>

              {/* ALBUM VIEW */}
              <div className="relative rounded-3xl p-10 md:p-20 border border-white/10 overflow-hidden backdrop-blur-sm bg-black/20">
                 <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black italic uppercase font-bebas text-white/[0.03] pointer-events-none select-none whitespace-nowrap">
                    {selectedAlbum.name}
                 </h2>

                 <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
                    {selectedAlbum.required_cards.map((cardId: string) => {
                      const player = MOCK_PLAYERS.find(p => p.id === cardId);
                      if (!player) return null;
                      
                      const isPasted = pastedCards[cardId];
                      const isOwned = (userCards[cardId] || 0) > 0;
                      
                      return (
                        <div key={player.id} className="space-y-6 flex flex-col items-center group/card">
                          <div className="relative w-full">
                             <StickerCard 
                               player={player} 
                               isOwned={isPasted || isOwned} 
                               onClick={() => setSelectedPlayer(player)}
                               className={cn("w-full transition-all duration-500", !isPasted && !isOwned && "grayscale opacity-40 scale-90 group-hover/card:scale-95 group-hover/card:opacity-60", !isPasted && isOwned && "opacity-60 scale-95")}
                             />
                              {!isPasted && !isOwned && (
                                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                                   <Lock size={32} className="text-white/20 group-hover/card:scale-110 transition-transform" />
                                </div>
                              )}
                              {!isPasted && isOwned && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/40 backdrop-blur-[2px] rounded-lg">
                                   <span className="text-xs font-bold text-white mb-2">Você tem {userCards[cardId]}</span>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); handlePasteCard(player.name, cardId); }}
                                     className="px-4 py-2 bg-primary text-black font-black uppercase tracking-widest rounded-sm transition-all italic text-[9px] hover:scale-105 shadow-xl shadow-primary/20"
                                   >
                                      Colar Figurinha
                                   </button>
                                </div>
                              )}
                          </div>
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

      <StickerPasteAnimation
        isVisible={pasteAnim.visible}
        playerName={pasteAnim.name}
        onComplete={() => {
          if (pasteAnim.cardId) pasteCard(pasteAnim.cardId);
          setPasteAnim({ visible: false, name: '', cardId: '' });
          toast.success(`${pasteAnim.name} colado no álbum!`);
        }}
      />
    </div>
  );
}
