'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';
import { Star, Shield, Sword } from 'lucide-react';

interface StickerCardProps {
  player: Player;
  isOwned?: boolean;
  isShiny?: boolean;
  isGolden?: boolean;
  quantity?: number;
  className?: string;
  onClick?: () => void;
}

export function StickerCard({ 
  player, 
  isOwned = true,
  isShiny, 
  isGolden,
  quantity, 
  className, 
  onClick
}: StickerCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 100, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = (mouseX / width - 0.5) * 100;
    const yPct = (mouseY / height - 0.5) * 100;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0); y.set(0); scale.set(1);
  }

  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case 'rare': return { frame: 'frame-rare', stars: 2, beam: '#3b82f6' };
      case 'epic': return { frame: 'frame-epic', stars: 3, beam: '#a855f7' };
      case 'legendary': return { frame: 'frame-legendary', stars: 4, beam: '#f59e0b' };
      case 'mythic': return { frame: 'frame-mythic', stars: 5, beam: '#fb923c' };
      default: return { frame: 'frame-common', stars: 1, beam: 'transparent' };
    }
  };

  const config = getRarityConfig(player.rarity);
  
  const getCountryCode = (country: string) => {
    const map: Record<string, string> = {
      'Brasil': 'br', 'França': 'fr', 'Inglaterra': 'gb-eng', 'Espanha': 'es', 
      'Argentina': 'ar', 'Bélgica': 'be', 'Portugal': 'pt', 'Alemanha': 'de'
    };
    return map[country] || 'un';
  };

  return (
    <div className={cn("relative group w-full", className)}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => scale.set(1.03)}
        style={{ rotateX, rotateY, scale }}
        onClick={onClick}
        className={cn(
          "relative aspect-[2/3] rounded-[24px] overflow-hidden transition-all duration-300 cursor-pointer flex flex-col font-outfit",
          "sticker-frame",
          isGolden ? "frame-golden" : config.frame,
          !isOwned ? "grayscale opacity-30 brightness-[0.4]" : "shadow-2xl shadow-black",
          isShiny && "holographic"
        )}
      >
        {/* PREMIUM BORDER BEAM EFFECT */}
        {isOwned && player.rarity !== 'common' && (
          <div className="border-beam-container">
            <div className="border-beam-light" style={{ '--beam-color': config.beam } as React.CSSProperties} />
          </div>
        )}

        <div className="relative w-full h-full bg-[#0a0a0c] overflow-hidden flex flex-col">
          {/* TOP SECTION: OVERALL & FLAG */}
          <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
            <div className="flex flex-col">
              <span className="text-white text-3xl font-black italic leading-none font-bebas drop-shadow-xl">
                {player.overall}
              </span>
              <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-1">
                {player.position}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 p-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
               <img 
                  src={`https://flagcdn.com/w20/${getCountryCode(player.country)}.png`} 
                  alt={player.country} 
                  className="w-5 h-3.5 rounded-sm object-cover"
               />
            </div>
          </div>

          {/* Player Photo */}
          <div className="flex-1 relative flex items-end justify-center overflow-hidden">
            {player.image_url ? (
              <img 
                src={player.image_url} 
                alt={player.name} 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-10 bg-slate-900">
                <Shield size={40} />
              </div>
            )}
            
            {/* Dark Gradient covering middle part */}
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent z-10" />
          </div>

          {/* FOOTER SECTION: LEGIBLE NAME & STATS */}
          <div className="relative z-30 bg-[#0a0a0c] pt-2 pb-5 px-4 flex flex-col items-center">
             {/* Stars row above name */}
             <div className="flex gap-0.5 mb-2">
              {Array.from({ length: config.stars }).map((_, i) => (
                <Star key={i} size={11} fill="currentColor" className="text-gold animate-star" />
              ))}
            </div>

             {/* NAME: High contrast, large and clear */}
             <div className="w-full py-1.5 mb-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                <h4 className="text-[14px] font-black uppercase text-white tracking-[0.1em] text-center drop-shadow-md">
                  {player.name}
                </h4>
             </div>

             {/* STATS: Simplified and clean */}
             <div className="w-full grid grid-cols-2 gap-4 px-2">
                <div className="flex items-center justify-center gap-2">
                   <Sword size={12} className="text-primary/50" />
                   <span className="text-[13px] font-black text-white italic">{player.stats.attack}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                   <Shield size={12} className="text-secondary/50" />
                   <span className="text-[13px] font-black text-white italic">{player.stats.defense}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Quantity Badge: Sticker Style */}
        {isOwned && quantity !== undefined && quantity > 1 && (
          <div className="absolute bottom-24 right-4 z-50 bg-primary text-black text-[10px] font-black px-3 py-1.5 rounded-xl shadow-2xl border-2 border-black/20 transform rotate-6">
            {quantity}X
          </div>
        )}

        {/* Golden Label */}
        {isGolden && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gold text-black text-[7px] font-black px-3 py-1 rounded-full border border-black/20 uppercase tracking-widest shadow-xl">
            LEGENDARY GOLD
          </div>
        )}
      </motion.div>
    </div>
  );
}
