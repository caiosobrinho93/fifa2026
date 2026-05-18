'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/types/game';
import { StickerCard } from './StickerCard';
import { X, Tag, Gift, RefreshCcw, ShoppingCart, Sparkles, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInventory } from '@/contexts/InventoryContext';

interface CardDetailsModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy?: () => void;
  showBuyOption?: boolean;
}

const rarityConfig = {
  common: {
    gradient: 'from-slate-800 to-slate-900',
    border: 'border-slate-600/40',
    glow: 'rgba(100,116,139,0.5)',
    accent: '#64748b',
    label: 'COMUM',
    badge: 'bg-slate-700 text-slate-300',
    shimmer: '#64748b',
  },
  rare: {
    gradient: 'from-blue-950 to-slate-900',
    border: 'border-blue-500/40',
    glow: 'rgba(59,130,246,0.6)',
    accent: '#3b82f6',
    label: 'RARO',
    badge: 'bg-blue-900/60 text-blue-300',
    shimmer: '#3b82f6',
  },
  epic: {
    gradient: 'from-purple-950 to-slate-900',
    border: 'border-purple-500/50',
    glow: 'rgba(168,85,247,0.7)',
    accent: '#a855f7',
    label: 'ÉPICO',
    badge: 'bg-purple-900/60 text-purple-300',
    shimmer: '#a855f7',
  },
  legendary: {
    gradient: 'from-amber-950 to-yellow-950',
    border: 'border-amber-400/60',
    glow: 'rgba(251,191,36,0.8)',
    accent: '#fbbf24',
    label: 'LENDÁRIO',
    badge: 'bg-amber-900/60 text-amber-300',
    shimmer: '#fbbf24',
  },
};

export function CardDetailsModal({ player, isOpen, onClose, onBuy, showBuyOption = true }: CardDetailsModalProps) {
  const { userCards } = useInventory();

  // ── Hooks SEMPRE antes de qualquer return condicional ──────────────────────


  // Early return APÓS todos os hooks
  if (!player) return null;

  const quantity    = userCards[player.id] || 0;
  const cfg         = rarityConfig[player.rarity as keyof typeof rarityConfig] ?? rarityConfig.common;
  const isLegendary = player.rarity === 'legendary';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 font-outfit">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative w-full sm:max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden',
              'bg-gradient-to-b', cfg.gradient,
              'border', cfg.border,
            )}
            style={{ boxShadow: `0 0 80px ${cfg.glow}, 0 40px 80px rgba(0,0,0,0.8)` }}
          >
            {/* ═══ ANIMAÇÃO LENDÁRIA — efeito nas bordas, não no centro ═══ */}
            {isLegendary && (
              <>
                {/* Vignette dourada nos cantos */}
                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    background: 'radial-gradient(ellipse at 0% 0%, rgba(251,191,36,0.12) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, rgba(251,191,36,0.08) 0%, transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(251,191,36,0.15) 0%, transparent 55%)',
                  }}
                />
              </>
            )}

            {/* Aura de raridade no topo */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-full"
              style={{ background: cfg.accent, boxShadow: `0 0 20px ${cfg.glow}` }}
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-white/5 hover:bg-white/15 rounded-full transition-all text-white/50 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 flex flex-col items-center gap-5 p-6 pt-8">
              {/* Badge de raridade — versão especial para lendário */}
              {isLegendary ? (
                <div
                  className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-900/60 border border-amber-400/60"
                  style={{ boxShadow: '0 0 20px rgba(251,191,36,0.4)' }}
                >
                  <Crown size={12} className="text-amber-400" fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">LENDÁRIO</span>
                  <Crown size={12} className="text-amber-400" fill="currentColor" />
                </div>
              ) : (
                <span className={cn('px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', cfg.badge)}>
                  {cfg.label}
                </span>
              )}

              {/* Card visual */}
              <div className="relative">
                <div
                  className="absolute -inset-8 blur-3xl rounded-full pointer-events-none opacity-40"
                  style={{ background: `radial-gradient(circle, ${cfg.glow}, transparent)` }}
                />
                <div className="w-[170px] md:w-[200px] relative z-10 mx-auto">
                  <StickerCard
                    player={player}
                    isOwned={true}
                    isShiny={['legendary', 'epic'].includes(player.rarity)}
                    className="shadow-2xl"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="text-center space-y-1">
                {isLegendary ? (
                  <motion.h2
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="text-3xl font-black italic uppercase font-bebas tracking-wider leading-none"
                    style={{
                      background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fcd34d, #fbbf24)',
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {player.name}
                  </motion.h2>
                ) : (
                  <h2 className="text-3xl font-black italic uppercase font-bebas tracking-wider text-white leading-none">
                    {player.name}
                  </h2>
                )}
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em]">
                  {player.country} · {player.position} · {player.overall} OVR
                </p>
                {quantity > 0 && (
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full mt-1"
                    style={{ background: `${cfg.accent}20`, border: `1px solid ${cfg.accent}40` }}
                  >
                    <Sparkles size={10} style={{ color: cfg.accent }} />
                    <span className="text-[10px] font-black" style={{ color: cfg.accent }}>
                      {quantity}x no inventário
                    </span>
                  </div>
                )}
              </div>

              {/* Stats (se disponíveis) */}
              {player.stats && (
                <div className="w-full grid grid-cols-3 gap-2">
                  {Object.entries(player.stats).map(([key, val]) => (
                    <div key={key} className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-lg font-black italic font-bebas" style={{ color: cfg.accent }}>{val}</span>
                      <span className="text-[8px] text-white/30 uppercase tracking-widest">{key}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Ações */}
              <div className="flex items-center gap-3 w-full pt-1">
                {showBuyOption ? (
                  <button
                    onClick={onBuy}
                    className="flex-1 py-3.5 rounded-xl font-black italic uppercase tracking-widest text-xs text-black flex items-center justify-center gap-2 transition-all active:scale-95"
                    style={{ background: cfg.accent, boxShadow: `0 8px 24px ${cfg.glow}` }}
                  >
                    <ShoppingCart size={16} />
                    Adquirir
                  </button>
                ) : (
                  <button
                    className="flex-1 py-3.5 rounded-xl font-black italic uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border"
                    style={{ borderColor: `${cfg.accent}50`, color: cfg.accent, background: `${cfg.accent}10` }}
                  >
                    <Tag size={16} />
                    Vender
                  </button>
                )}
                <button
                  title="Enviar como presente"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Gift size={18} />
                </button>
                <button
                  title="Propor troca"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <RefreshCcw size={18} />
                </button>
              </div>

              {/* Spacer seguro para iOS */}
              <div className="h-safe-bottom sm:hidden" style={{ height: 'env(safe-area-inset-bottom, 8px)' }} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
