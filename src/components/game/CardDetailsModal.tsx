'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/types/game';
import { StickerCard } from './StickerCard';
import { X, Shield, Sword, Zap, Target, Users, Flame, Trophy, Coins, Share2, Star, ShoppingCart, Sparkles, Box } from 'lucide-react';
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

  const rarityColor = 
    player.rarity === 'mythic' ? '#fb923c' : 
    player.rarity === 'legendary' ? '#f59e0b' : 
    player.rarity === 'epic' ? '#a855f7' : '#3b82f6';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-8 font-outfit overflow-hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#060608]/98 backdrop-blur-3xl"
          >
             <div 
               className="absolute inset-0 opacity-20"
               style={{ 
                 background: `radial-gradient(circle at center, ${rarityColor} 0%, transparent 70%)` 
               }} 
             />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-6xl flex flex-col z-10 overflow-hidden"
          >
            {/* Close Button: Repositioned for mobile to avoid overlap with Search button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-[10000] p-4 bg-white/10 rounded-full text-white hover:text-primary transition-all active:scale-90 xl:hidden"
            >
              <X size={28} />
            </button>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-12 xl:p-0">
               <div className="flex flex-col xl:flex-row items-center justify-center gap-12 xl:h-full py-20 xl:py-0">
                  
                  {/* Left Column: Card Showcase */}
                  <div className="relative flex flex-col items-center shrink-0">
                     {/* desktop close button */}
                     <button 
                        onClick={onClose}
                        className="absolute -top-20 -right-20 hidden xl:flex p-4 text-white/30 hover:text-white transition-all"
                      >
                        <X size={40} />
                      </button>

                     <motion.div
                       animate={{ 
                          y: [0, -15, 0],
                       }}
                       transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                       }}
                       className="relative z-20"
                     >
                        <div 
                          className="absolute inset-0 blur-[100px] opacity-40 rounded-full scale-125"
                          style={{ backgroundColor: rarityColor }}
                        />
                        <StickerCard 
                          player={player} 
                          isOwned={quantity > 0} 
                          quantity={quantity}
                          className="w-[260px] md:w-[350px] shadow-[0_0_80px_rgba(0,0,0,0.8)]" 
                        />
                     </motion.div>

                     {/* Shadow pedestal */}
                     <div className="mt-12 w-40 h-6 bg-black/60 blur-xl rounded-full" />
                  </div>

                  {/* Right Column: Details & Actions */}
                  <div className="flex-1 w-full max-w-xl space-y-8 pb-12 xl:pb-0">
                     <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                           <span className={cn(
                              "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                              player.rarity === 'mythic' ? "border-mythic/50 text-mythic bg-mythic/10 shadow-mythic-glow" :
                              player.rarity === 'legendary' ? "border-gold/50 text-gold bg-gold/10 shadow-gold-glow" : 
                              player.rarity === 'epic' ? "border-accent/50 text-accent bg-accent/10" : "border-secondary/50 text-secondary bg-secondary/10"
                           )}>
                              {player.rarity} EDITION
                           </span>
                           {quantity > 0 && (
                              <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 border border-success/30 text-success text-[10px] font-black uppercase tracking-widest">
                                 <Box size={12} />
                                 {quantity} NA COLEÇÃO
                              </span>
                           )}
                        </div>
                        
                        <h2 className="text-6xl md:text-8xl font-black text-white italic uppercase font-bebas leading-[0.8] tracking-wider">
                          {player.name}
                        </h2>
                        
                        <div className="flex items-center gap-6 pt-2">
                           <div className="flex items-center gap-3">
                              <img 
                                src={`https://flagcdn.com/w40/${player.country === 'Brasil' ? 'br' : 'fr'}.png`} 
                                alt={player.country} 
                                className="w-8 h-auto rounded shadow-lg"
                              />
                              <span className="text-xl font-black text-white italic font-bebas uppercase tracking-widest">{player.country}</span>
                           </div>
                           <div className="w-px h-6 bg-white/10" />
                           <span className="text-xl font-black text-white/40 italic font-bebas uppercase tracking-widest">{player.position}</span>
                        </div>
                     </div>

                     {/* Stats Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <StatItem label="Ataque" value={player.stats.attack} icon={Sword} color="text-gold" />
                        <StatItem label="Defesa" value={player.stats.defense} icon={Shield} color="text-secondary" />
                        <StatItem label="Velocidade" value={player.stats.speed} icon={Zap} color="text-mythic" />
                        <StatItem label="Passe" value={player.stats.pass} icon={Users} color="text-accent" />
                     </div>

                     {showBuyOption && (
                        <div className="bg-[#0a0a0c] p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                           <div>
                              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block mb-1">MERCADO OFICIAL</span>
                              <div className="flex items-baseline gap-3">
                                 <Coins size={20} className="text-gold" />
                                 <span className="text-4xl font-black text-white italic font-bebas">12.500</span>
                                 <span className="text-[10px] font-black text-white/40 uppercase">COINS</span>
                              </div>
                           </div>
                           <button 
                             onClick={onBuy}
                             className="w-full md:w-auto px-10 py-5 md:py-6 bg-primary text-black font-black rounded-2xl md:rounded-3xl text-[10px] md:text-xs uppercase tracking-[0.3em] italic shadow-gold-glow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                           >
                              <ShoppingCart size={18} />
                              ADQUIRIR
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function StatItem({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) {
  return (
    <div className="bg-white/5 p-4 md:p-5 rounded-[24px] md:rounded-[32px] border border-white/5 flex items-center justify-between">
       <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center", color)}>
             <Icon size={18} />
          </div>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</span>
       </div>
       <span className="text-2xl font-black text-white italic font-bebas">{value}</span>
    </div>
  );
}
