'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/types/game';
import { StickerCard } from './StickerCard';
import { X, Shield, Target, Zap, Trophy, Users, ShoppingCart, RefreshCcw, Star, Box, Tag, Gift, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_USER_CARDS } from '@/lib/mock-data';

interface CardDetailsModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy?: () => void;
  showBuyOption?: boolean;
}

export function CardDetailsModal({ player, isOpen, onClose, onBuy, showBuyOption = true }: CardDetailsModalProps) {
  if (!player) return null;

  const userCard = MOCK_USER_CARDS.find(c => c.player_id === player.id);
  const quantity = userCard?.quantity || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4 font-outfit overflow-hidden">
          {/* Overlay Sólido e Escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/98 backdrop-blur-md"
          />
                   <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="relative w-full max-w-sm bg-nebula border border-white/10 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden p-6 md:p-8 flex flex-col items-center gap-8"
          >
            {/* Close Button */}
            <button 
               onClick={onClose} 
               className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white z-50"
            >
               <X size={20} />
            </button>

            {/* The Hero Asset */}
            <div className="relative group mt-4">
               {/* Prismatic Aura */}
               <div className="absolute -inset-16 blur-[60px] opacity-20 bg-gradient-to-r from-cyan-500 via-emerald-500 to-magenta-500 animate-spin-slow" />
               
               <div className="relative z-10 transition-transform duration-500 group-hover:scale-105">
                  <StickerCard 
                     player={player} 
                     isOwned={true} 
                     className="w-[200px] md:w-[240px] shadow-2xl" 
                  />
               </div>
            </div>

            {/* Action Menu: Icon-Style Command Dock */}
            <div className="w-full space-y-8 relative z-10">
               <div className="text-center">
<h2 className="text-3xl md:text-4xl font-black italic uppercase font-bebas text-prismatic tracking-[0.25em] leading-tight px-2">
                      {player.name}
                   </h2>
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mt-3 flex items-center justify-center gap-2">
                     <span className="w-8 h-px bg-white/10" />
                     Protocol_ID: #{player.id.toUpperCase()}
                     <span className="w-8 h-px bg-white/10" />
                  </p>
               </div>

               <div className="flex justify-center items-center gap-4">
                  {/* MAIN ACTION: ACQUIRE (if applicable) */}
                  {showBuyOption ? (
                     <button 
                        onClick={onBuy}
                        title="Adquirir Ativo"
                        className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-700 text-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(6,182,212,0.4)] hover:scale-110 active:scale-95 transition-all"
                     >
                        <ShoppingCart size={24} />
                     </button>
                  ) : (
                     /* MARKETPLACE ICON */
                     <button 
                        title="Anunciar no Mercado"
                        className="w-16 h-16 glass-cyan text-cyan-400 rounded-2xl flex items-center justify-center hover:bg-cyan-500/20 transition-all group"
                     >
                        <Tag size={24} className="group-hover:rotate-12 transition-transform" />
                     </button>
                  )}

                  {/* GIFT ICON */}
                  <button 
                     title="Enviar Presente"
                     className="w-16 h-16 glass text-white/60 rounded-2xl flex items-center justify-center hover:text-white hover:bg-white/10 transition-all"
                  >
                     <Gift size={24} />
                  </button>

                  {/* TRADE ICON */}
                  <button 
                     title="Solicitar Troca"
                     className="w-16 h-16 glass text-white/60 rounded-2xl flex items-center justify-center hover:text-white hover:bg-white/10 transition-all"
                  >
                     <RefreshCcw size={24} />
                  </button>

                  {/* DESTROY ICON */}
                  <button 
                     title="Destruir Ativo (Burn)"
                     className="w-16 h-16 glass-magenta text-magenta-500 rounded-2xl flex items-center justify-center hover:bg-magenta-500/20 transition-all group"
                  >
                     <Trash2 size={24} className="group-hover:scale-110 transition-transform" />
                  </button>
               </div>

               {quantity > 0 && (
                 <div className="flex justify-center">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Ownership_Certified</span>
                       <div className="w-px h-3 bg-white/10" />
                       <span className="text-sm font-black text-cyan-400 italic font-bebas">{quantity}X Units</span>
                    </div>
                 </div>
               )}
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
