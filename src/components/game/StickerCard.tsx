'use client';

import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CustomCardConfig {
  starPosition: 'left' | 'right' | 'top' | 'bottom';
  overallPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  nameBarHeight: number;
  nameBarBg: string;
  statsBg: string;
  accentColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  overlayOpacity: number;
  fontStyle: 'bebas' | 'mono' | 'sans';
  showFlag: boolean;
  starsGlow: boolean;
}

interface StickerCardProps {
  player: Player;
  isOwned?: boolean;
  isShiny?: boolean;
  isGolden?: boolean;
  hasEssence?: boolean;
  quantity?: number;
  className?: string;
  isMini?: boolean;
  rarityOverride?: CardRarity;
  onClick?: () => void;
  variant?: 'normal' | 'custom';
  customConfig?: CustomCardConfig;
}

export function StickerCard({ 
  player, 
  isOwned = true,
  isShiny, 
  isGolden,
  hasEssence = (player as Record<string, unknown>).has_essence as boolean,
  quantity, 
  className,
  rarityOverride,
  onClick,
  variant = 'normal',
  customConfig
}: StickerCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rarity = rarityOverride || (player.rarity as CardRarity) || 'common';
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), springConfig);
  const scaleSpring = useSpring(1, { stiffness: 300, damping: 20 });

  // Generate deterministic particles values to avoid Math.random() in render loop
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => {
      // Simple pseudo-random deterministic generation based on index
      const sin1 = Math.sin(i * 123.456);
      const sin2 = Math.sin(i * 654.321);
      const cos1 = Math.cos(i * 789.101);
      
      return {
        left: 15 + (sin1 + 1) * 35, // 15% to 85%
        xRange: [sin2 * 60, cos1 * 90],
        duration: 2 + Math.abs(sin1) * 2,
        delay: Math.abs(cos1) * 4
      };
    });
  }, []);

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
    scaleSpring.set(1.02);
  }

  function handleMouseLeave() {
    x.set(0); y.set(0); scaleSpring.set(1);
  }

  const getCountryCode = (country: string) => {
    const map: Record<string, string> = {
      'Brasil': 'br', 'França': 'fr', 'Inglaterra': 'gb-eng', 'Espanha': 'es', 
      'Argentina': 'ar', 'Bélgica': 'be', 'Portugal': 'pt', 'Alemanha': 'de',
      'Noruega': 'no', 'Egito': 'eg', 'Holanda': 'nl', 'Uruguai': 'uy',
      'Croácia': 'hr', 'Coréia do Sul': 'kr', 'Polônia': 'pl', 'Marrocos': 'ma'
    };
    return map[country] || 'un';
  };

  const skins = {
    common: {
      accent: 'text-blue-500',
      starFill: 'fill-blue-500 text-blue-500',
      border: 'border-white/10',
      nameBg: 'bg-transparent',
      overallGlow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]',
      textOutline: 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]',
      bgGradient: 'from-black via-black/20 to-transparent'
    },
    rare: {
      accent: 'text-slate-200',
      starFill: 'fill-slate-200 text-slate-200',
      border: 'border-slate-300/40',
      nameBg: 'bg-transparent',
      overallGlow: 'drop-shadow-[0_0_10px_rgba(226,232,240,0.5)]',
      textOutline: 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]',
      bgGradient: 'from-slate-900/40 via-black/20 to-transparent'
    },
    epic: {
      accent: 'text-purple-400',
      starFill: 'fill-purple-400 text-purple-400',
      border: 'border-purple-500/60',
      nameBg: 'bg-gradient-to-t from-purple-900/80 to-transparent',
      overallGlow: 'drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]',
      textOutline: 'drop-shadow-[0_1px_0px_#000] drop-shadow-[0_-1px_0px_#000] drop-shadow-[1px_0_0px_#000] drop-shadow-[1px_0_0px_#000]',
      bgGradient: 'from-purple-950/50 via-black/30 to-transparent'
    },
    legendary: {
      accent: 'text-amber-400',
      starFill: 'fill-amber-400 text-amber-400',
      border: 'border-amber-400/80',
      nameBg: 'bg-gradient-to-t from-amber-600/90 to-transparent',
      overallGlow: 'drop-shadow-[0_0_20px_rgba(251,191,36,1)]',
      textOutline: 'drop-shadow-[0_1px_0px_#000] drop-shadow-[0_-1px_0_#000] drop-shadow-[1px_0_0px_#000] drop-shadow-[-1px_0_0px_#000]',
      bgGradient: 'from-amber-950/80 via-black/40 to-amber-900/30'
    }
  };

  const isLegendary = rarity === 'legendary';
  const skin = isLegendary ? skins.legendary : (skins[rarity as keyof typeof skins] || skins.common);

  const isCustom = variant === 'custom' && customConfig;
  
  const fontClass = isCustom
    ? customConfig.fontStyle === 'bebas' ? 'font-bebas' : customConfig.fontStyle === 'mono' ? 'font-mono' : 'font-sans'
    : 'font-bebas';

  // Stars positioning & color
  const starsStyle = isCustom && customConfig.starsGlow
    ? { filter: `drop-shadow(0 0 6px ${customConfig.accentColor})` }
    : undefined;

  const renderStars = () => {
    const starCount = player.stars || 1;
    const isCol = isCustom && (customConfig.starPosition === 'left' || customConfig.starPosition === 'right');
    return (
      <div 
        className={cn("flex gap-1 z-40 transition-all duration-300", isCol ? "flex-col" : "flex-row")}
        style={starsStyle}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div key={star} whileHover={{ scale: 1.2 }}>
            <Star 
              size={9} 
              className={cn(
                "transition-all duration-500",
                isCustom
                  ? (star <= starCount ? "" : "text-white/10")
                  : (star <= starCount ? skin.starFill : "text-white/10")
              )} 
              style={
                isCustom && star <= starCount
                  ? { fill: customConfig.accentColor, color: customConfig.accentColor }
                  : undefined
              }
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const getStarsPosClass = () => {
    if (!isCustom) return "absolute top-[15px] left-1/2 -translate-x-1/2";
    const pos = customConfig.starPosition;
    if (pos === 'top') return "absolute top-[15px] left-1/2 -translate-x-1/2";
    if (pos === 'bottom') return "absolute bottom-[60px] left-1/2 -translate-x-1/2";
    if (pos === 'left') return "absolute left-[15px] top-1/2 -translate-y-1/2";
    if (pos === 'right') return "absolute right-[15px] top-1/2 -translate-y-1/2";
    return "absolute top-[15px] left-1/2 -translate-x-1/2";
  };

  const getOverallPosClass = () => {
    if (!isCustom) return "absolute right-[15px] top-[10px]";
    const pos = customConfig.overallPosition;
    if (pos === 'top-left') return "absolute left-[15px] top-[10px]";
    if (pos === 'top-right') return "absolute right-[15px] top-[10px]";
    if (pos === 'bottom-left') return "absolute left-[15px] bottom-[50px]";
    if (pos === 'bottom-right') return "absolute right-[15px] bottom-[50px]";
    return "absolute right-[15px] top-[10px]";
  };

  return (
    <div className={cn("relative group w-full h-full p-[4px]", className)}>
      
      {/* Main Card Body */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{ 
          rotateX, 
          rotateY, 
          scale: scaleSpring,
          borderRadius: isCustom ? `${customConfig.borderRadius}px` : undefined,
          borderColor: isCustom ? customConfig.borderColor : undefined,
          borderWidth: isCustom ? `${customConfig.borderWidth}px` : undefined
        }}
        className={cn(
          "relative aspect-[2/3] overflow-hidden transition-all duration-500 cursor-pointer flex flex-col rounded-2xl border z-10 bg-black",
          !isCustom && skin.border,
          !isOwned && "grayscale opacity-30 brightness-[0.4]",
          (isLegendary && !isCustom) && "shadow-[0_0_20px_rgba(251,191,36,0.5)] border-amber-400/90",
          (isCustom && customConfig.starsGlow) && `shadow-[0_0_15px_${customConfig.accentColor}40]`
        )}
      >
        {/* PLAYER IMAGE */}
        <img 
          src={player.image_url} 
          alt={player.name} 
          className={cn(
            "absolute inset-0 w-full h-full object-cover object-top transition-all duration-700",
            (isLegendary || isCustom) ? "brightness-110 contrast-115 scale-105" : "brightness-95 contrast-105"
          )} 
        />
        
        {/* VIGNETTE */}
        {!isCustom ? (
          <div className={cn("absolute inset-0 bg-gradient-to-t pointer-events-none opacity-90", skin.bgGradient)} />
        ) : (
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-500" 
            style={{ 
              background: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,${customConfig.overlayOpacity}) 60%, rgba(0,0,0,0) 100%)` 
            }} 
          />
        )}

        {/* 🌟 PARTICLES */}
        {((isLegendary && !isCustom) || (isCustom && customConfig.starsGlow)) && (
           <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              {particles.map((p, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [100, -350],
                    x: p.xRange,
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0]
                  }}
                  transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
                  className="absolute bottom-0 w-1 h-1 bg-white rounded-full"
                  style={{ 
                    left: `${p.left}%`,
                    boxShadow: `0 0 8px ${isCustom ? customConfig.accentColor : '#fbbf24'}`
                  }}
                />
              ))}
              
              <motion.div 
                animate={{ left: ["-100%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-full bg-white/5 -skew-x-12 blur-3xl pointer-events-none"
              />
           </div>
        )}

        {/* STARS */}
        <div className={cn("z-40 transition-all duration-500", getStarsPosClass())}>
          {renderStars()}
        </div>

        {/* OVERALL */}
        <div className={cn("z-40 transition-all duration-500", getOverallPosClass())}>
          <span 
            className={cn(
              "font-black text-4xl italic tracking-tighter leading-none transition-all duration-500", 
              fontClass,
              !isCustom && skin.accent, 
              !isCustom && skin.overallGlow, 
              skin.textOutline
            )}
            style={isCustom ? { 
              color: customConfig.accentColor, 
              filter: customConfig.starsGlow ? `drop-shadow(0 0 8px ${customConfig.accentColor})` : undefined 
            } : undefined}
          >
             {player.overall}
          </span>
        </div>

        {/* BOTTOM SECTION */}
        <div className="absolute bottom-0 left-0 right-0 z-40">
           
           {/* Stats Bar */}
           <div 
             className="px-[15px] py-1.5 flex justify-between items-center transition-all duration-500"
             style={isCustom ? { background: customConfig.statsBg } : undefined}
           >
              <div className="flex gap-4">
                 <span 
                   className={cn(
                     "font-black text-xl leading-none transition-all duration-500", 
                     fontClass,
                     !isCustom && skin.accent, 
                     skin.textOutline, 
                     !isCustom && skin.overallGlow
                   )}
                   style={isCustom ? { 
                     color: customConfig.accentColor, 
                     filter: customConfig.starsGlow ? `drop-shadow(0 0 4px ${customConfig.accentColor})` : undefined 
                   } : undefined}
                 >
                   {player.stats.attack}
                 </span>
                 <span 
                   className={cn(
                     "font-black text-xl leading-none transition-all duration-500", 
                     fontClass,
                     !isCustom && skin.accent, 
                     skin.textOutline, 
                     !isCustom && skin.overallGlow
                   )}
                   style={isCustom ? { 
                     color: customConfig.accentColor, 
                     filter: customConfig.starsGlow ? `drop-shadow(0 0 4px ${customConfig.accentColor})` : undefined 
                   } : undefined}
                 >
                   {player.stats.defense}
                 </span>
              </div>
              <div className="flex items-center gap-2">
                 <span className={cn("text-[10px] font-black text-white/40 italic tracking-widest", fontClass)}>
                   {player.position}
                 </span>
                 {(!isCustom || customConfig.showFlag) && (
                   <img 
                     src={`https://flagcdn.com/w40/${getCountryCode(player.country || 'un')}.png`} 
                     alt={player.country || 'Bandeira'}
                     className="w-7 h-4 opacity-100 shadow-2xl rounded-sm" 
                   />
                 )}
              </div>
           </div>

           {/* Name Bar */}
           <div 
             className={cn(
               "h-[38px] flex items-center justify-center relative overflow-hidden transition-all duration-500 px-4", 
               !isCustom && skin.nameBg
             )}
             style={isCustom ? { 
               height: `${customConfig.nameBarHeight}px`,
               background: customConfig.nameBarBg 
             } : undefined}
           >
              {(isLegendary && !isCustom) && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              )}
              {isCustom && (
                <div 
                  className="absolute inset-0 opacity-10 animate-shimmer"
                  style={{ backgroundImage: `linear-gradient(90deg, transparent, ${customConfig.accentColor}, transparent)` }}
                />
              )}
              <h4 
                className={cn(
                  "text-white font-black uppercase text-sm italic tracking-[0.2em] leading-none truncate relative z-10", 
                  fontClass,
                  skin.textOutline
                )}
              >
                 {player.name}
              </h4>
           </div>

        </div>
        
      </motion.div>
    </div>
  );
}
