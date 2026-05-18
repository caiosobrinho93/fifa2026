'use client';

import React, { useState, useMemo } from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { MOCK_PLAYERS } from "@/lib/mock-data";
import { StickerCard } from "@/components/game/StickerCard";
import { CardDetailsModal } from "@/components/game/CardDetailsModal";
import { Search, SlidersHorizontal, TrendingUp, Flame, Clock, Zap, Star, Filter } from "lucide-react";
import { Player } from "@/types/game";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useInventory } from "@/contexts/InventoryContext";

// Preços simulados por raridade
const rarityPrices: Record<string, number> = {
  common: 150, rare: 500, epic: 1800, legendary: 6500
};

// Tags de destaque simuladas
const hotTags = ['🔥 QUENTE', '⚡ FLASH', '⏱ EXPIRANDO', '⭐ DESTAQUE'];

type FilterType = 'todos' | 'common' | 'rare' | 'epic' | 'legendary';
type SortType = 'trending' | 'preco_asc' | 'preco_desc' | 'recente';

export default function MarketplacePage() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [activeSort, setActiveSort] = useState<SortType>('trending');
  const [featured, setFeatured] = useState<Player | null>(null);

  // Memoiza lista e destaca o primeiro lendário como featured
  const playersWithMeta = useMemo(() => {
    return MOCK_PLAYERS.map((p, i) => ({
      ...p,
      price: rarityPrices[p.rarity] + Math.floor((i * 137) % 200),
      hotTag: i % 5 === 0 ? hotTags[i % hotTags.length] : null,
      timeLeft: i % 7 === 0 ? `${Math.floor((i * 7) % 23) + 1}h ${Math.floor((i * 13) % 59)}m` : null,
    }));
  }, []);

  const filteredPlayers = useMemo(() => {
    let list = playersWithMeta;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.country ?? '').toLowerCase().includes(q));
    }
    if (activeFilter !== 'todos') list = list.filter(p => p.rarity === activeFilter);
    if (activeSort === 'preco_asc') list = [...list].sort((a, b) => a.price - b.price);
    if (activeSort === 'preco_desc') list = [...list].sort((a, b) => b.price - a.price);
    if (activeSort === 'recente') list = [...list].reverse();
    return list;
  }, [playersWithMeta, search, activeFilter, activeSort]);

  const router = useRouter();
  const { addCards } = useInventory();

  // Pega o card mais caro como destaque do topo
  const featuredCard = useMemo(() =>
    playersWithMeta.filter(p => p.rarity === 'legendary')[0] || playersWithMeta[0], [playersWithMeta]);

  const handleBuy = (player: Player) => {
    // Add the card to the user's inventory
    addCards([player.id]);

    toast.success(`${player.name} adquirido!`, {
      description: `${rarityPrices[player.rarity]} coins debitados.`,
      action: {
        label: 'Ver Inventário',
        onClick: () => { router.push('/inventory'); }
      }
    });
    setSelectedPlayer(null);
  };

  const filterButtons: { key: FilterType; label: string; color: string }[] = [
    { key: 'todos',    label: 'Todos',     color: 'text-white border-white/20 bg-white/5' },
    { key: 'common',  label: 'Comum',     color: 'text-slate-300 border-slate-500/40 bg-slate-800/40' },
    { key: 'rare',    label: 'Raro',      color: 'text-blue-400 border-blue-500/40 bg-blue-900/30' },
    { key: 'epic',    label: 'Épico',     color: 'text-purple-400 border-purple-500/40 bg-purple-900/30' },
    { key: 'legendary', label: 'Lendário', color: 'text-amber-400 border-amber-500/40 bg-amber-900/30' },
  ];

  return (
    <div className="bg-background min-h-screen text-white font-outfit selection:bg-primary/30">
      <Header />

      <main className="pb-40 pt-28 md:pt-36 px-4 md:px-8 max-w-[1600px] mx-auto space-y-8">

        {/* ── HERO: Card em destaque ── */}
        {featuredCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden border border-amber-500/20 cursor-pointer group"
            onClick={() => setSelectedPlayer(featuredCard)}
            style={{ background: 'linear-gradient(135deg, #1a1200, #0a0a1a)' }}
          >
            {/* Background glow lendário */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(251,191,36,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(168,85,247,0.08),transparent_60%)]" />
            
            {/* Shimmer */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
              className="absolute inset-y-0 w-1/4 skew-x-12 opacity-5 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
              {/* Card visual */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="flex-shrink-0 w-32 md:w-44"
              >
                <StickerCard player={featuredCard} isOwned={true} isShiny={true} />
              </motion.div>

              {/* Info */}
              <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-400 text-[10px] font-black uppercase tracking-widest">
                    ⭐ DESTAQUE DO DIA
                  </span>
                  <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Flame size={10} /> LENDÁRIO
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black italic uppercase font-bebas text-white tracking-tight leading-none">
                  {featuredCard.name}
                </h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                  {featuredCard.country} · {featuredCard.position} · {featuredCard.overall} OVR
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                  <div className="text-3xl font-black italic font-bebas text-amber-400">
                    {featuredCard.price?.toLocaleString()} <span className="text-lg text-amber-400/60">COINS</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleBuy(featuredCard); }}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black italic uppercase text-xs tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/30"
                  >
                    Comprar Agora
                  </button>
                </div>
              </div>

              {/* Stats laterais */}
              {featuredCard.stats && (
                <div className="hidden md:grid grid-cols-2 gap-2 flex-shrink-0">
                  {Object.entries(featuredCard.stats).slice(0, 4).map(([key, val]) => (
                    <div key={key} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-center">
                      <div className="text-xl font-black italic font-bebas text-amber-400">{val}</div>
                      <div className="text-[8px] text-white/30 uppercase tracking-widest">{key}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── HEADER + FILTROS ── */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase font-bebas tracking-tight leading-none">
                Mercado <span className="text-primary">Live</span>
              </h1>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] italic mt-1">
                {filteredPlayers.length} cards disponíveis · Atualizado em tempo real
              </p>
            </div>

            {/* Stats rápidas */}
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-emerald-900/20 border border-emerald-500/20 px-4 py-2 rounded-xl">
                <TrendingUp size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">+12% hoje</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
                <Zap size={14} className="text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">1.2M vol.</span>
              </div>
            </div>
          </div>

          {/* Busca */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar jogador, seleção..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all"
              />
            </div>
            <select
              value={activeSort}
              onChange={e => setActiveSort(e.target.value as SortType)}
              className="bg-white/[0.03] border border-white/5 rounded-xl px-4 text-xs font-black text-white/60 focus:outline-none focus:border-primary/40 cursor-pointer"
            >
              <option value="trending">🔥 Trending</option>
              <option value="preco_asc">💸 Menor preço</option>
              <option value="preco_desc">💎 Maior preço</option>
              <option value="recente">🆕 Recentes</option>
            </select>
          </div>

          {/* Filtros de raridade */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {filterButtons.map(btn => (
              <button
                key={btn.key}
                onClick={() => setActiveFilter(btn.key)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all',
                  btn.color,
                  activeFilter === btn.key ? 'opacity-100 scale-105 shadow-lg' : 'opacity-40 hover:opacity-70'
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── GRID DE CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPlayers.map((player, i) => (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedPlayer(player)}
              >
                {/* Tag de destaque */}
                {player.hotTag && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase rounded-full whitespace-nowrap shadow-lg">
                    {player.hotTag}
                  </div>
                )}

                {/* Timer se estiver expirando */}
                {player.timeLeft && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-0.5 bg-black/80 border border-orange-500/40 rounded-full">
                    <Clock size={8} className="text-orange-400" />
                    <span className="text-[8px] font-black text-orange-400">{player.timeLeft}</span>
                  </div>
                )}

                <StickerCard
                  player={player}
                  isOwned={true}
                  isShiny={['legendary', 'epic'].includes(player.rarity)}
                />

                {/* Preço overlay no hover */}
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all rounded-b-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black italic font-bebas text-amber-400">
                      {player.price?.toLocaleString()} C
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBuy(player); }}
                      className="px-2 py-1 bg-primary text-black text-[8px] font-black uppercase rounded-md transition-all active:scale-95"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPlayers.length === 0 && (
          <div className="py-24 text-center space-y-4">
            <Search size={40} className="text-white/10 mx-auto" />
            <p className="text-white/20 font-black uppercase tracking-widest text-sm">Nenhum card encontrado</p>
          </div>
        )}
      </main>

      <BottomNav />

      <CardDetailsModal
        player={selectedPlayer}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        onBuy={() => selectedPlayer && handleBuy(selectedPlayer)}
        showBuyOption={true}
      />
    </div>
  );
}
