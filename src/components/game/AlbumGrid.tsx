'use client';

import React, { useState } from 'react';
import { Player, UserCard } from '@/types/game';
import { StickerCard } from './StickerCard';
import { CardDetailsModal } from './CardDetailsModal';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlbumGridProps {
  players: Player[];
  userCards: UserCard[];
}

export function AlbumGrid({ players, userCards }: AlbumGridProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const itemsPerPage = 8;
  
  const ownedPlayerIds = new Set(userCards.map(c => c.player_id));
  const totalPages = Math.ceil(players.length / itemsPerPage);
  
  const currentPlayers = players.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="space-y-12">
      <CardDetailsModal 
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        showBuyOption={false}
      />
      
      {/* Album Navigation - Solid Design */}
      <div className="flex items-center justify-between bg-[#0f172a] p-8 rounded-[40px] border border-white/5 shadow-2xl">
        <button 
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className="p-5 bg-black/40 hover:bg-black/60 text-white rounded-3xl disabled:opacity-20 transition-all active:scale-90 border border-white/5"
        >
          <ChevronLeft size={28} />
        </button>
        
        <div className="text-center flex flex-col items-center gap-2">
           <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
              <BookOpen size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Navegação do Álbum</span>
           </div>
           <p className="text-4xl font-black italic text-white tracking-tighter leading-none">
              PÁGINA {currentPage + 1} <span className="text-white/20">/</span> {totalPages}
           </p>
        </div>

        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage === totalPages - 1}
          className="p-5 bg-black/40 hover:bg-black/60 text-white rounded-3xl disabled:opacity-20 transition-all active:scale-90 border border-white/5"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Players Grid */}
      <div className="grid card-grid-mobile gap-6 md:gap-10">
        {currentPlayers.map((player) => {
          const isOwned = ownedPlayerIds.has(player.id);
          
          return (
            <div key={player.id} className="relative">
               <StickerCard 
                 player={player} 
                 isOwned={isOwned}
                 onClick={() => isOwned && setSelectedPlayer(player)}
                 className="max-w-none"
               />
               {!isOwned && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em] rotate-[-45deg] whitespace-nowrap">BLOQUEADO</span>
                 </div>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
