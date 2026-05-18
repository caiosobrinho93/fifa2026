'use client';

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Player, Pack } from '@/types/game';
import { StickerCard } from './StickerCard';
import confetti from 'canvas-confetti';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInventory } from '@/contexts/InventoryContext';

interface PackOpenerProps {
  pack: Pack;
  cards: Player[];
  onClose: () => void;
}

// ─── Cores por raridade ──────────────────────────────────────────────────────
const RC: Record<string, { glow: string; accent: string; label: string; particle: string }> = {
  common:    { glow: 'rgba(100,116,139,0.7)', accent: '#64748b', label: 'COMUM',    particle: '#94a3b8' },
  rare:      { glow: 'rgba(59,130,246,0.9)',  accent: '#3b82f6', label: 'RARO',     particle: '#93c5fd' },
  epic:      { glow: 'rgba(168,85,247,1)',    accent: '#a855f7', label: 'ÉPICO',    particle: '#d8b4fe' },
  legendary: { glow: 'rgba(251,191,36,1)',    accent: '#fbbf24', label: 'LENDÁRIO', particle: '#fde68a' },
};

// ─── Partículas burst radiais ────────────────────────────────────────────────
function Burst({ color, count = 16 }: { color: string; count?: number }) {
  const items = useMemo(() => Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * 360;
    const dist  = 80 + (i % 4) * 30;
    const rad   = (angle * Math.PI) / 180;
    return { x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, delay: i * 0.02, size: i % 3 === 0 ? 8 : 5 };
  }), [count]);
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {items.map((p, i) => (
        <motion.div key={i}
          initial={{ x: 0, y: 0, scale: 1, opacity: 0.9 }}
          animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
          transition={{ duration: 0.55, delay: p.delay, ease: 'easeOut' }}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: color, boxShadow: `0 0 ${p.size * 2}px ${color}` }}
        />
      ))}
    </div>
  );
}

// ─── Efeito Épico Lendário (Substitui os raios giratórios) ────────────────────
function LegendaryReveal({ color }: { color: string }) {
  const particles = useMemo(() => Array.from({ length: 24 }).map((_, i) => ({
    x: (Math.random() - 0.5) * 150,
    y: (Math.random() - 0.5) * 150 + 100,
    delay: Math.random() * 0.5,
    dur: 1.5 + Math.random(),
    size: Math.random() > 0.5 ? 4 : 2
  })), []);

  return (
    <>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${color}30 0%, transparent 60%)` }}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: p.y, x: p.x }}
            animate={{ opacity: [0, 1, 0], y: p.y - 150 }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{ width: p.size, height: p.size, background: color, boxShadow: `0 0 ${p.size*2}px ${color}` }}
          />
        ))}
      </div>
    </>
  );
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
export function PackOpener({ pack, cards, onClose }: PackOpenerProps) {
  type Step = 'idle' | 'shake' | 'burst' | 'reveal' | 'flip' | 'fan' | 'done';
  const [step, setStep]           = useState<Step>('idle');
  const [cardIdx, setCardIdx]     = useState(0);
  const [flipped, setFlipped]     = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [fanExpand, setFanExpand] = useState(false);
  const { addCards } = useInventory();

  const currentCard = cards[cardIdx] ?? cards[0];
  const rarity      = currentCard?.rarity ?? 'common';
  const rc          = RC[rarity] ?? RC.common;
  const isLegendary = rarity === 'legendary';

  // Partículas de fundo
  const bgParticles = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    left: `${((i * 43 + 11) % 88) + 6}%`,
    bottom: `${((i * 61 + 7) % 78) + 8}%`,
    dur: 2.5 + (i % 4) * 0.5,
    delay: (i * 0.28) % 3,
    size: i % 3 === 0 ? 3 : 2,
  })), []);

  // Burst de confetti canvas
  const fireConfetti = useCallback((legendary: boolean) => {
    const opts = { origin: { y: 0.6 }, zIndex: 300 };
    if (legendary) {
      confetti({ ...opts, particleCount: 120, spread: 60, colors: ['#fbbf24','#f59e0b','#fde68a','#ffffff'], startVelocity: 60 });
      confetti({ ...opts, particleCount: 60, spread: 120, decay: 0.9, scalar: 0.8, colors: ['#fbbf24','#f59e0b'] });
    } else {
      confetti({ ...opts, particleCount: 50, spread: 50, startVelocity: 45 });
    }
  }, []);

  // ── Fluxo principal ──────────────────────────────────────────────────────
  const openPack = () => {
    setStep('shake');
    setTimeout(() => { setStep('burst'); }, 700);
    setTimeout(() => {
      setStep('reveal');
      setCardIdx(0);
      setFlipped(false);
      setTimeout(() => {
        setFlipped(true);
        setShowBurst(true);
        if (isLegendary) fireConfetti(true);
        setTimeout(() => setShowBurst(false), 800);
      }, 300);
    }, 1500);
  };

  const nextCard = () => {
    setFlipped(false);
    setShowBurst(false);
    if (cardIdx < cards.length - 1) {
      setTimeout(() => {
        const next = cardIdx + 1;
        setCardIdx(next);
        setTimeout(() => {
          setFlipped(true);
          setShowBurst(true);
          if (cards[next]?.rarity === 'legendary') fireConfetti(true);
          else if (cards[next]?.rarity === 'epic') fireConfetti(false);
          setTimeout(() => setShowBurst(false), 800);
        }, 250);
      }, 300);
    } else {
      setStep('fan');
      setTimeout(() => setFanExpand(true), 100);
      fireConfetti(cards.some(c => c.rarity === 'legendary'));
    }
  };

  const revealAll = () => {
    setStep('fan');
    setTimeout(() => setFanExpand(true), 100);
    fireConfetti(cards.some(c => c.rarity === 'legendary'));
  };

  const saveAndClose = () => {
    setStep('done');
    addCards(cards.map(c => c.id));
    setTimeout(onClose, 1200);
  };

  // ── Ângulos do leque (fan) ───────────────────────────────────────────────
  const fanAngles = useMemo(() => {
    const n = cards.length;
    return cards.map((_, i) => {
      const spread = Math.min(n * 14, 90);
      return -spread / 2 + (i / (n - 1 || 1)) * spread;
    });
  }, [cards]);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-hidden bg-[#030712]">
      {/* Radial bg color da raridade */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background: `radial-gradient(ellipse at center, ${rc.glow}18 0%, transparent 65%)` }}
      />

      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        {bgParticles.map((p, i) => (
          <motion.div key={i}
            animate={{ y: [0, -100, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute rounded-full"
            style={{ left: p.left, bottom: p.bottom, width: p.size, height: p.size, background: rc.particle }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════════════════════════
            STEP: IDLE — Pack fechado esperando clique
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 'idle' && (
          <motion.div key="idle"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            className="flex flex-col items-center gap-8 z-10 px-4 w-full max-w-xs"
          >
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: rc.accent }}>⚡ PRONTO PARA ABRIR</p>
              <h2 className="text-5xl md:text-6xl font-black italic uppercase font-bebas text-white tracking-tight leading-none">{pack.name}</h2>
              <p className="text-white/25 text-xs">{cards.length} cartas exclusivas te aguardam</p>
            </div>

            {/* Pack 3D */}
            <motion.button
              whileHover={{ scale: 1.06, rotateY: 8, rotateX: -4 }}
              whileTap={{ scale: 0.94 }}
              onClick={openPack}
              style={{ perspective: 800 }}
              className="relative cursor-pointer group"
            >
              {/* Aura */}
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -inset-8 blur-3xl rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${rc.glow}, transparent)` }}
              />
              {/* Card do pack */}
              <motion.div
                animate={{ y: [0, -10, 0], rotateZ: [-1.5, 1.5, -1.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-52 h-72 rounded-[2rem] border overflow-hidden shadow-2xl"
                style={{
                  background: `linear-gradient(145deg, #0f172a, #1e1b4b)`,
                  borderColor: `${rc.accent}60`,
                  boxShadow: `0 0 40px ${rc.glow}, 0 30px 60px rgba(0,0,0,0.8)`,
                }}
              >
                {/* Shimmer correndo */}
                <motion.div
                  animate={{ x: ['-120%', '220%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                  className="absolute inset-y-0 w-1/3 skew-x-12 pointer-events-none opacity-20"
                  style={{ background: `linear-gradient(90deg, transparent, ${rc.accent}, transparent)` }}
                />
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: `linear-gradient(135deg, ${rc.glow}, transparent 55%)` }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-2xl"
                    style={{ background: `radial-gradient(circle, ${rc.glow}, transparent)`, border: `2px solid ${rc.accent}60` }}
                  >
                    ⚡
                  </div>
                  <div>
                    <p className="text-white/50 text-[9px] font-black uppercase tracking-[0.3em]">Toque para abrir</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {Array.from({ length: Math.min(cards.length, 8) }).map((_, i) => (
                        <div key={i} className="w-1.5 h-2.5 rounded-full" style={{ background: `${rc.accent}50` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.button>

            <button onClick={onClose} className="text-white/20 hover:text-white/50 text-[10px] font-black uppercase tracking-widest transition-all">
              Cancelar
            </button>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP: SHAKE — Pack tremendo antes de explodir
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 'shake' && (
          <motion.div key="shake"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center z-10"
          >
            <motion.div
              animate={{
                x: [0, -18, 18, -12, 12, -6, 6, 0],
                y: [0, -8,   8,  -5,  5,  -3, 3, 0],
                rotate: [0, -8, 8, -5, 5, -2, 2, 0],
                scale: [1, 1.05, 0.95, 1.08, 0.95, 1.02, 0.98, 1],
              }}
              transition={{ duration: 0.65, ease: 'easeInOut' }}
              className="w-52 h-72 rounded-[2rem] border overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #0f172a, #1e1b4b)',
                borderColor: `${rc.accent}60`,
                boxShadow: `0 0 80px ${rc.glow}`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-5xl">⚡</div>
            </motion.div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP: BURST — Explosão de abertura
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 'burst' && (
          <motion.div key="burst"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex items-center justify-center z-10"
          >
            {/* Flash branco */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 bg-white z-[300]"
            />
            {/* Shockwave rings */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div key={i}
                initial={{ scale: 0, opacity: 0.9 }}
                animate={{ scale: 6 + i * 2, opacity: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
                className="absolute w-16 h-16 rounded-full border-2"
                style={{ borderColor: rc.accent }}
              />
            ))}
            <Burst color={rc.particle} count={24} />
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP: REVEAL — Card a card com flip 3D
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 'reveal' && currentCard && (
          <motion.div key={`reveal-${cardIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6 z-10 px-4 w-full max-w-sm"
          >
            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {cards.map((c, i) => (
                <motion.div key={i}
                  animate={{ width: i === cardIdx ? 28 : 8 }}
                  className="h-1.5 rounded-full transition-all"
                  style={{ background: i <= cardIdx ? RC[c.rarity]?.accent ?? '#fff' : 'rgba(255,255,255,0.1)' }}
                />
              ))}
            </div>

            {/* Raridade badge */}
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="px-6 py-1.5 rounded-full font-bebas text-xl tracking-widest border"
              style={{ color: rc.accent, borderColor: `${rc.accent}60`, background: `${rc.accent}15`, boxShadow: `0 0 24px ${rc.glow}30` }}
            >
              {rc.label}
            </motion.div>

            {/* Card com flip 3D */}
            <div className="relative" style={{ perspective: 1000 }}>
              {/* Aura */}
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -inset-10 blur-3xl rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${rc.glow}, transparent)` }}
              />
              {/* Burst de partículas ao revelar */}
              <AnimatePresence>{showBurst && <Burst color={rc.particle} count={isLegendary ? 28 : 16} />}</AnimatePresence>
              {/* Animação Lendária */}
              {isLegendary && flipped && <LegendaryReveal color={rc.accent} />}

              {/* Flip 3D */}
              <motion.div
                animate={{ rotateY: flipped ? 0 : 90 }}
                transition={{ type: 'spring', damping: 14, stiffness: 120 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative w-[190px] md:w-[220px]"
              >
                <StickerCard
                  player={currentCard}
                  isOwned={true}
                  isShiny={['legendary', 'epic'].includes(rarity)}
                />
              </motion.div>
            </div>

            {/* Nome */}
            <div className="text-center space-y-1">
              <h3 className="text-3xl font-black italic uppercase font-bebas text-white tracking-wider leading-none">
                {currentCard.name}
              </h3>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">
                {currentCard.country} · {currentCard.position} · {currentCard.overall} OVR
              </p>
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-2.5 w-full">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={nextCard}
                className="w-full py-4 rounded-2xl font-black italic uppercase tracking-widest text-sm flex items-center justify-center gap-3 text-black transition-all active:scale-95"
                style={{ background: rc.accent, boxShadow: `0 8px 30px ${rc.glow}50` }}
              >
                {cardIdx === cards.length - 1 ? '🏆 Ver Todos' : 'Próximo'}
                <ChevronRight size={18} />
              </motion.button>
              {cardIdx < cards.length - 1 && (
                <button onClick={revealAll} className="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/25 hover:text-white/60 transition-all border border-white/5">
                  Revelar Todos de Uma Vez ⚡
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP: FAN — Leque estilo Hearthstone + Revelar Todos
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 'fan' && (
          <motion.div key="fan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-8 z-10 w-full px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-5xl md:text-6xl font-black italic uppercase font-bebas text-white">
                {cards.length} Cards <span className="text-primary">Abertos!</span>
              </h2>
            </motion.div>

            {/* Leque de cards */}
            <div className="relative flex items-end justify-center" style={{ height: 280, width: '100%', maxWidth: 600 }}>
              {cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{
                    y: 300, rotate: 0, opacity: 0,
                    x: -(cards.length / 2 - i) * 8,
                  }}
                  animate={{
                    y: fanExpand ? Math.abs(fanAngles[i]) * 0.8 : 300,
                    rotate: fanExpand ? fanAngles[i] : 0,
                    opacity: fanExpand ? 1 : 0,
                    x: (i - (cards.length - 1) / 2) * (cards.length > 5 ? 40 : 50),
                  }}
                  transition={{ type: 'spring', damping: 15, stiffness: 120, delay: i * 0.06 }}
                  whileHover={{ y: (Math.abs(fanAngles[i]) * 0.8) - 24, scale: 1.12, zIndex: 50, rotate: 0 }}
                  className="absolute w-[100px] md:w-[120px] cursor-pointer"
                  style={{ originX: '50%', originY: '100%', zIndex: i }}
                >
                  <StickerCard
                    player={card}
                    isOwned={true}
                    isShiny={['legendary', 'epic'].includes(card.rarity)}
                  />
                  <div className="mt-1 text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: RC[card.rarity]?.accent }}>
                      {RC[card.rarity]?.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Salvar */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveAndClose}
              className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-primary text-black font-black italic uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:bg-yellow-400 transition-all border border-yellow-300/50"
            >
              <CheckCircle2 size={22} className="text-black" />
              Adicionar ao Inventário
            </motion.button>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP: DONE — Feedback de salvamento
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 'done' && (
          <motion.div key="done"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-5 text-center z-10"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center"
            >
              <CheckCircle2 size={44} className="text-emerald-400" />
            </motion.div>
            <div>
              <h3 className="text-5xl font-black italic uppercase font-bebas text-emerald-400">Salvos!</h3>
              <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mt-1">Cards adicionados ao inventário</p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}