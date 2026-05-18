'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface StickerPasteAnimationProps {
  isVisible: boolean;
  playerName: string;
  onComplete: () => void;
}

export function StickerPasteAnimation({ isVisible, playerName, onComplete }: StickerPasteAnimationProps) {
  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(onComplete, 1400);
      return () => clearTimeout(t);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
        >
          {/* Flash de luz */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.25, 0] }}
            transition={{ duration: 0.5, times: [0, 0.2, 1] }}
            className="absolute inset-0 bg-white"
          />

          {/* Ondas de impacto (stamp rings) */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.3, opacity: 0.8 }}
              animate={{ scale: 2.5 + i * 0.8, opacity: 0 }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: 'easeOut' }}
              className="absolute w-40 h-40 rounded-full border-2 border-primary"
            />
          ))}

          {/* Partículas que explodem para fora */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360;
            const distance = 80 + (i % 3) * 30;
            const rad = (angle * Math.PI) / 180;
            return (
              <motion.div
                key={`p-${i}`}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: Math.cos(rad) * distance,
                  y: Math.sin(rad) * distance,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#fbbf24' : '#ffffff',
                }}
              />
            );
          })}

          {/* Ícone central de check com "stamp" effect */}
          <motion.div
            initial={{ scale: 2.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200, duration: 0.4 }}
            className="relative flex flex-col items-center gap-3"
          >
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.8)]">
              <CheckCircle2 size={40} className="text-white" />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white font-black italic uppercase text-sm tracking-widest font-bebas text-center bg-black/60 backdrop-blur-sm px-4 py-2 rounded-xl"
            >
              {playerName} colado!
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
