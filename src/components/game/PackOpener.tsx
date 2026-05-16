'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player, Pack } from '@/types/game';
import { StickerCard } from './StickerCard';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PackOpenerProps {
  pack: Pack;
  cards: Player[];
  onClose: () => void;
}

export function PackOpener({ pack, cards, onClose }: PackOpenerProps) {
  const [step, setStep] = useState<'closed' | 'opening' | 'revealing'>('closed');
  const [revealedIndex, setRevealedIndex] = useState(-1);

  const startOpening = () => {
    setStep('opening');
    setTimeout(() => {
      setStep('revealing');
      setRevealedIndex(0);
      triggerConfetti();
    }, 1500);
  };

  const nextCard = () => {
    if (revealedIndex < cards.length - 1) {
      setRevealedIndex(prev => prev + 1);
      if (cards[revealedIndex + 1].rarity === 'legendary' || cards[revealedIndex + 1].rarity === 'mythic') {
        triggerConfetti();
      }
    } else {
      onClose();
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'closed' && (
          <motion.div
            key="closed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0, filter: 'blur(20px)' }}
            className="flex flex-col items-center gap-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={startOpening}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                  "relative w-56 h-80 glass border-4 rounded-[40px] flex flex-col items-center justify-center p-8 shadow-2xl",
                  pack.rarity === 'legendary' ? "border-gold shadow-gold-glow" : "border-primary shadow-glow"
                )}
              >
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <Sparkles className={pack.rarity === 'legendary' ? "text-gold animate-spin-slow" : "text-primary animate-spin-slow"} size={48} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-center mb-2">{pack.name}</h3>
                <div className="px-4 py-1.5 bg-black/40 rounded-full border border-white/5">
                  <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase italic">TOQUE PARA ABRIR</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {step === 'opening' && (
          <motion.div
            key="opening"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: [1, 1.2, 1.1, 1.3, 20], 
              rotate: [0, 5, -5, 10, -10, 0],
              filter: ['blur(0px)', 'blur(0px)', 'blur(10px)', 'blur(40px)']
            }}
            transition={{ duration: 1.5 }}
            className="w-56 h-80 glass border-4 border-white rounded-[40px] bg-white shadow-[0_0_100px_white]"
          />
        )}

        {step === 'revealing' && revealedIndex >= 0 && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-10 w-full max-w-lg"
          >
            <div className="text-center space-y-2">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-block px-4 py-1 bg-white/5 border border-white/10 rounded-full"
              >
                <span className="text-[10px] font-black text-primary tracking-[0.3em] uppercase italic">
                  REVELANDO CARTA {revealedIndex + 1} DE {cards.length}
                </span>
              </motion.div>
              <motion.h2 
                key={`rarity-${revealedIndex}`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-black italic uppercase tracking-tighter"
              >
                {cards[revealedIndex].rarity}
              </motion.h2>
            </div>

            <motion.div
              key={`card-${revealedIndex}`}
              initial={{ scale: 0.5, rotateY: 180, opacity: 0, y: 50 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 100 }}
              className="w-full max-w-[240px] sm:max-w-[300px]"
            >
              <StickerCard 
                player={cards[revealedIndex]} 
                isShiny={cards[revealedIndex].rarity === 'legendary' || cards[revealedIndex].rarity === 'mythic' || cards[revealedIndex].rarity === 'epic'}
                className="max-w-none sm:max-w-none"
              />
            </motion.div>

            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={nextCard}
              className="group bg-white text-black font-black py-5 px-16 rounded-[24px] shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-95 transition-all flex items-center gap-4 text-sm tracking-widest uppercase"
            >
              {revealedIndex < cards.length - 1 ? 'PRÓXIMA CARTA' : 'FECHAR PACK'}
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
