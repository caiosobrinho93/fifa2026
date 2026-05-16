'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player, Pack } from '@/types/game';
import { StickerCard } from './StickerCard';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Star, Zap, Crown, Package, Save, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInventory } from '@/contexts/InventoryContext';

interface PackOpenerProps {
  pack: Pack;
  cards: Player[];
  onClose: () => void;
}

const rarityConfig = {
  common: { color: '#64748b', icon: Package, label: 'COMUM', sound: 'low' },
  rare: { color: '#3b82f6', icon: Star, label: 'RARO', sound: 'mid' },
  epic: { color: '#a855f7', icon: Zap, label: 'ÉPICO', sound: 'high' },
  legendary: { color: '#fbbf24', icon: Crown, label: 'LENDÁRIO', sound: 'ultra' }
};

export function PackOpener({ pack, cards, onClose }: PackOpenerProps) {
  const [step, setStep] = useState<'closed' | 'opening' | 'single' | 'summary' | 'saving'>('closed');
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addCards } = useInventory();
  const [showVariants, setShowVariants] = useState(true);

  const previewPlayer: Player = {
    id: 'preview',
    name: 'Lionel Messi',
    image_url: 'https://www.fifarosters.com/assets/players/fifa24/faces/158023.png',
    country: 'Argentina',
    position: 'ATA',
    overall: 94,
    stars: 5,
    type: 'player',
    rarity: 'legendary',
    is_golden: true,
    probability: 0.005,
    dust_reward: 500,
    created_at: new Date().toISOString(),
    stats: { attack: 94, defense: 34, speed: 85, dribble: 96, pass: 94, physical: 65 }
  };

  const bgParticles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const sin1 = Math.sin(i * 987.654);
      const sin2 = Math.sin(i * 456.789);
      const cos1 = Math.cos(i * 123.456);
      
      return {
        x: sin1 * 20 - 10,
        duration: 2 + Math.abs(sin2) * 2,
        delay: Math.abs(cos1) * 2,
        left: 10 + Math.abs(sin1) * 80,
        bottom: 10 + Math.abs(cos1) * 80
      };
    });
  }, []);

  const startOpening = () => {
    setStep('opening');
    setTimeout(() => {
      setStep('single');
      setRevealedIndex(0);
      triggerImpactEffect(cards[0].rarity);
    }, 2500);
  };

  const nextCard = () => {
    if (revealedIndex < cards.length - 1) {
      const nextIdx = revealedIndex + 1;
      setRevealedIndex(nextIdx);
      triggerImpactEffect(cards[nextIdx].rarity);
    } else {
      setStep('summary');
    }
  };

  const revealAll = () => {
    setStep('summary');
    triggerConfetti();
  };

  const handleSave = () => {
    setStep('saving');
    
    // Persist to local inventory
    const cardIds = cards.map(c => c.id);
    addCards(cardIds);

    // Close after save animation
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const triggerImpactEffect = (rarity: string) => {
    if (rarity === 'legendary' || rarity === 'epic') {
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    const defaults = { origin: { y: 0.7 }, zIndex: 200 };
    confetti({ ...defaults, particleCount: 40, spread: 26, startVelocity: 55 });
    confetti({ ...defaults, particleCount: 40, spread: 60 });
    confetti({ ...defaults, particleCount: 40, spread: 100, decay: 0.91, scalar: 0.8 });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#050505] overflow-hidden">
      {/* Dynamic Magical Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
        <AnimatePresence>
          {step === 'opening' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_50%)]"
            />
          )}
        </AnimatePresence>
        
        {/* Particle Field */}
        <div className="absolute inset-0 opacity-20">
          {bgParticles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [-20, -100],
                x: p.x
              }}
              transition={{ 
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ 
                left: `${p.left}%`,
                bottom: `${p.bottom}%`
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'closed' && (
          <motion.div
            key="closed"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0, filter: 'blur(20px)' }}
            className="flex flex-col items-center gap-6 relative z-10 w-full max-w-7xl px-4"
          >
            {/* STYLE SHOWCASE */}
            {showVariants && (
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full mb-8 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl md:text-2xl font-black text-white italic uppercase font-bebas tracking-widest">
                    Selecione o Estilo da sua Coleção
                  </h3>
                  <button 
                    onClick={() => setShowVariants(false)}
                    className="text-white/40 hover:text-white text-[10px] uppercase font-bold tracking-widest transition-colors"
                  >
                    [ Fechar Vitrine ]
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {(['common', 'rare', 'epic', 'legendary'] as const).map((v) => (
                    <div key={v} className="flex flex-col items-center gap-3 group">
                      <div className="w-full transition-transform group-hover:scale-105 duration-300">
                        <StickerCard player={previewPlayer} rarityOverride={v} isOwned={true} />
                      </div>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] italic opacity-60 group-hover:opacity-100 transition-opacity",
                        v === 'legendary' ? "text-amber-400" : v === 'epic' ? "text-purple-400" : v === 'rare' ? "text-slate-300" : "text-blue-500"
                      )}>
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="text-center space-y-4">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-6xl font-black italic uppercase font-bebas tracking-tighter text-white"
              >
                {pack.name}
              </motion.h2>
              <p className="text-primary text-xs font-black uppercase tracking-[0.4em] italic">Dispositivo de Origem: Protocol_2026</p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startOpening}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                  "relative w-56 h-72 rounded-[2rem] bg-gradient-to-br from-slate-900 to-[#0a0a0a] border-2 border-white/10 p-1 shadow-2xl",
                  "flex flex-col items-center justify-center gap-8 overflow-hidden"
                )}
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="relative z-10 w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Sparkles size={48} className="text-primary" />
                </div>
                <div className="relative z-10 space-y-2 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Clique para Iniciar</span>
                  <div className="flex justify-center gap-1">
                    {Array.from({ length: cards.length }).map((_, i) => (
                      <div key={i} className="w-2 h-3 rounded-full bg-primary/20" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <button onClick={onClose} className="text-white/20 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all italic border-b border-white/0 hover:border-white/20">
              Abortar Protocolo
            </button>
          </motion.div>
        )}

        {step === 'opening' && (
          <motion.div
            key="opening"
            className="relative flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: [0, 1.2, 0.8, 10], rotate: [0, 90, 180, 360] }}
              transition={{ duration: 2.5, ease: "anticipate" }}
              className="w-64 h-64 rounded-full border-4 border-primary shadow-[0_0_100px_rgba(59,130,246,0.5)] flex items-center justify-center bg-white"
            >
              <div className="w-full h-full bg-primary/20 animate-ping rounded-full" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2.5 }}
              className="absolute inset-0 bg-white z-[100]"
            />
          </motion.div>
        )}

        {step === 'single' && revealedIndex >= 0 && (
            <motion.div
              key={`single-${revealedIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex flex-col items-center gap-4 md:gap-10 w-full max-w-lg relative z-10 px-4"
            >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/20 font-black italic">{String(revealedIndex + 1).padStart(2, '0')}</span>
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-white/20 font-black italic">{String(cards.length).padStart(2, '0')}</span>
              </div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                  "px-8 py-2 rounded-xl border-2 font-bebas italic text-2xl tracking-widest",
                  cards[revealedIndex].rarity === 'legendary' ? "border-amber-500 bg-amber-500/10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]" :
                  cards[revealedIndex].rarity === 'epic' ? "border-purple-500 bg-purple-500/10 text-purple-500" :
                  cards[revealedIndex].rarity === 'rare' ? "border-blue-500 bg-blue-500/10 text-blue-500" :
                  "border-slate-500 bg-slate-500/10 text-slate-500"
                )}
              >
                {cards[revealedIndex].rarity.toUpperCase()}
              </motion.div>
            </div>

            <motion.div
              initial={{ scale: 0.5, rotateY: 90, y: 50 }}
              animate={{ scale: 1, rotateY: 0, y: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 100 }}
              className="w-full max-w-[180px] md:max-w-[280px]"
            >
              <StickerCard 
                player={cards[revealedIndex]} 
                isOwned={true}
                isShiny={['legendary', 'epic'].includes(cards[revealedIndex].rarity)}
              />
            </motion.div>

            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full px-8">
              <button 
                onClick={nextCard}
                className="w-full md:w-auto px-10 py-3.5 md:py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black italic flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95 uppercase text-sm tracking-widest order-1 md:order-2"
              >
                <span>{revealedIndex === cards.length - 1 ? 'Finalizar' : 'Próximo Card'}</span>
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={revealAll}
                className="w-full md:w-auto px-6 py-3 md:py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest italic hover:bg-white/10 transition-all text-white/40 hover:text-white order-2 md:order-1"
              >
                Revelar Todos
              </button>
            </div>
          </motion.div>
        )}

        {step === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 md:gap-12 w-full max-w-6xl relative z-10 p-4 md:p-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-7xl font-black italic uppercase font-bebas tracking-tighter text-white">
                Pack <span className="text-primary">Concluído</span>
              </h2>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] italic">Novos ativos detectados e prontos para sincronização</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-white/40 text-center text-xs font-black uppercase tracking-widest">Common</h3>
                <StickerCard player={previewPlayer} rarityOverride="common" />
              </div>
              <div className="space-y-4">
                <h3 className="text-white/40 text-center text-xs font-black uppercase tracking-widest">Rare</h3>
                <StickerCard player={previewPlayer} rarityOverride="rare" />
              </div>
              <div className="space-y-4">
                <h3 className="text-white/40 text-center text-xs font-black uppercase tracking-widest">Epic</h3>
                <StickerCard player={previewPlayer} rarityOverride="epic" />
              </div>
              <div className="space-y-4">
                <h3 className="text-white/40 text-center text-xs font-black uppercase tracking-widest">Legendary</h3>
                <StickerCard player={previewPlayer} rarityOverride="legendary" />
              </div>
            </div>

            {/* Horizontal Scroll Showcase */}
            <div className="relative w-full max-w-[100vw] overflow-hidden">
              <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-8 px-[10%] py-12 no-scrollbar scroll-smooth snap-x snap-mandatory"
              >
                {cards.map((player, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ delay: i * 0.15, type: 'spring', damping: 15 }}
                      className="flex-shrink-0 w-40 md:w-72 snap-center"
                    >
                    <div className="relative group/card">
                       <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity rounded-xl" />
                       <StickerCard 
                         player={player} 
                         isOwned={true}
                         isShiny={['legendary', 'epic'].includes(player.rarity)}
                       />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Subtle Gradient Overlays for Scroll */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none z-20" />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-20" />
            </div>

            <button 
              onClick={handleSave}
              className="w-[80%] md:w-auto px-8 md:px-16 py-4 md:py-6 rounded-[2rem] bg-gradient-to-r from-success to-emerald-600 hover:from-success/90 hover:to-emerald-500 text-white font-black italic flex items-center justify-center gap-4 shadow-2xl shadow-success/20 transition-all active:scale-95 uppercase tracking-widest text-base md:text-lg"
            >
              <Save size={20} className="md:w-6 md:h-6" />
              Sincronizar Inventário
            </button>
          </motion.div>
        )}

        {step === 'saving' && (
          <motion.div
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-24 h-24 rounded-full border-4 border-success border-t-transparent"
            />
            <div className="space-y-2">
              <h3 className="text-3xl font-black italic uppercase font-bebas text-success">Sincronizando...</h3>
              <p className="text-white/20 text-xs font-black uppercase tracking-widest italic">Vinculando IDs à sua carteira digital</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}