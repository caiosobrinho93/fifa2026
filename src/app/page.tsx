'use client';

import React from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { 
  Trophy, 
  Sparkles, 
  TrendingUp, 
  LayoutDashboard, 
  History, 
  ArrowRight,
  Target,
  Zap,
  Star,
  PackageOpen,
  ChevronRight,
  User
} from "lucide-react";
import Link from 'next/link';
import { MOCK_PLAYERS } from '@/lib/mock-data';
import { StickerCard } from '@/components/game/StickerCard';
import { CardDetailsModal } from '@/components/game/CardDetailsModal';
import { cn } from '@/lib/utils';
import { Player } from '@/types/game';

export default function Home() {
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);
  const trendingPlayers = MOCK_PLAYERS.slice(0, 8);
  const featuredPlayer = MOCK_PLAYERS[0];

  return (
    <div className="bg-background min-h-screen text-white font-outfit selection:bg-primary/30">
      <Header />
      
      <main className="pb-40 pt-24 px-4 md:px-8 max-w-[1600px] mx-auto space-y-20">

        {/* HERO SECTION - CLEAN BROADCAST VERSION */}
        <section className="relative min-h-[420px] flex items-center overflow-visible">
          {/* Subtle Dynamic Background */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[2rem] border border-white/5">
             <div className="absolute inset-0 bg-[#0a0a0a]" />
             <div className="absolute top-0 right-0 w-full h-full opacity-35 mix-blend-screen pointer-events-none">
                <img 
                  src="/fifa2026/images/hero-banner.png" 
                  alt="" 
                  className="w-full h-full object-cover origin-right scale-105"
                />
             </div>
             {/* Gradient Overlays */}
             <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,242,255,0.03)_0%,transparent_50%)]" />
             
             {/* Tech Grid Overlay */}
             <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
          </div>

          <div className="relative z-10 w-full grid lg:grid-cols-12 gap-8 items-center px-6 md:px-12 py-8">
          <div 
            style={{ animation: 'fadeSlideLeft 0.6s ease forwards' }}
            className="lg:col-span-7 space-y-6"
          >
              {/* Tactical Badge */}
              <div className="flex items-center gap-4">
                 <div className="h-[2px] w-8 bg-primary" />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 italic">Global Protocol_26</span>
              </div>

              {/* Clean Typographic Header */}
              <div className="space-y-1">
                <h1 className="text-5xl md:text-7xl xl:text-8xl font-black italic uppercase leading-none font-bebas pr-8 flex flex-wrap items-center gap-x-4">
                  <span className="text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">FIFA</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary/80">2026</span>
                </h1>
              </div>

              {/* Mission Statement */}
              <div className="max-w-xl space-y-6">
                <p className="text-base md:text-lg text-white/50 font-bold italic uppercase tracking-wider leading-relaxed border-l-2 border-primary/30 pl-4">
                  A evolução definitiva do colecionismo digital. <br className="hidden md:block" />
                  <span className="text-white">Colecione os astros e domine o ranking mundial.</span>
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/packs" className="relative px-8 py-4 bg-gradient-to-r from-primary via-cyan-500 to-primary text-black font-black uppercase italic tracking-[0.2em] text-[10px] rounded-sm hover:scale-105 active:scale-95 transition-all shadow-[0_5px_20px_rgba(0,242,255,0.3)] overflow-hidden group">
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-25deg]" />
                    <span className="relative z-10">INICIAR COLEÇÃO</span>
                  </Link>
                  <Link href="/marketplace" className="px-8 py-4 bg-white/[0.02] border border-white/10 text-white font-black uppercase italic tracking-[0.2em] text-[10px] rounded-sm hover:bg-white/10 transition-all backdrop-blur-sm">
                    MERCADO LIVE
                  </Link>
                </div>
              </div>
          </div>

          {/* Featured Hero Card */}
          <div 
            style={{ animation: 'fadeScaleIn 0.7s ease forwards' }}
            className="lg:col-span-5 flex justify-center lg:justify-end relative"
          >
              <div className="relative scale-90 md:scale-95 lg:scale-100">
                {/* Aura Effects */}
                <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full" />
                
                <div className="relative z-10 transform rotate-[2deg] hover:rotate-0 transition-all duration-500">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-60 transition duration-700" />
                    <div className="relative w-[240px] md:w-[280px]">
                      <StickerCard 
                        player={featuredPlayer} 
                        isOwned={true} 
                        onClick={() => setSelectedPlayer(featuredPlayer)}
                      />
                    </div>
                  </div>
                </div>
              </div>
          </div>
          </div>
        </section>

        {/* MARKET GRID - SPORTY VERSION */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/5 pb-10">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-1 bg-primary" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Hot Market</span>
               </div>
              <h2 className="text-5xl md:text-6xl font-black italic uppercase font-bebas tracking-tighter leading-none">Destaques <span className="text-white/20">do</span> <span className="text-primary">Mercado</span></h2>
              <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] italic max-w-md">As figurinhas mais valorizadas e raras sendo negociadas agora.</p>
            </div>
            <Link href="/marketplace" className="px-8 py-4 bg-white/5 border border-white/10 text-[10px] font-black text-white hover:bg-primary hover:text-black uppercase tracking-[0.3em] flex items-center gap-4 transition-all italic group rounded-sm">
              CATÁLOGO COMPLETO <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
            {trendingPlayers.map((player, index) => (
              <div 
                key={player.id}
                style={{ animation: `fadeUp 0.5s ease forwards`, animationDelay: `${index * 80}ms`, opacity: 0 }}
              >
                <StickerCard 
                  player={player} 
                  isOwned={true} 
                  onClick={() => setSelectedPlayer(player)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ATIVIDADE E DESAFIO - SPORTY LAYOUT */}
        <section className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
              <div className="flex items-center gap-4">
                <Trophy size={32} className="text-primary" />
                <h2 className="text-4xl font-black italic uppercase font-bebas tracking-widest text-white">Últimas Transações</h2>
             </div>
             <div className="grid md:grid-cols-2 gap-4">
               <ActivityLog user="Caio" action="Comprou" target="NEY-LEN-5" time="2m" />
               <ActivityLog user="Elena" action="Anunciou" target="MES-EPI-3" time="5m" />
               <ActivityLog user="Pedro" action="Abriu" target="Pack Elite" time="12m" />
               <ActivityLog user="Alpha" action="Trocou" target="VIN-LEN-5" time="15m" />
             </div>
          </div>
          
          <div className="relative group cursor-pointer overflow-hidden rounded-xl border border-primary/20">
              {/* Challenge Card Background */}
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
              
              <div className="relative p-8 h-full flex flex-col justify-between z-10">
                <div className="space-y-6">
                   <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.4)]">
                      <Zap size={24} className="text-black" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-5xl font-black italic uppercase font-bebas tracking-widest leading-none">Desafio <br /><span className="text-primary">Brasil 2026</span></h3>
                      <p className="text-white/60 text-sm font-bold italic uppercase tracking-tighter leading-tight">Complete o esquadrão canarinho e ganhe um card mítico exclusivo.</p>
                   </div>
                </div>

                <button className="w-full py-5 bg-white text-black hover:bg-primary transition-all text-[11px] font-black uppercase tracking-[0.2em] italic mt-10 rounded-sm">
                   INICIAR MISSÃO
                </button>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>
        </section>
      </main>

      <BottomNav />
      
      <CardDetailsModal 
        player={selectedPlayer} 
        isOpen={!!selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
      />
    </div>
  );
}

function StatItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-white/2 p-10 rounded-lg border border-white/5 hover:border-white/10 transition-all group">
       <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] block mb-4">{label}</span>
       <span className={cn("text-5xl font-black italic font-bebas tracking-wider block", color)}>{value}</span>
    </div>
  );
}

function ActivityLog({ user, action, target, time }: { user: string, action: string, target: string, time: string }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-sm border border-white/5 hover:bg-white/5 transition-all">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
             <User size={18} className="text-primary" />
          </div>
          <div>
             <span className="text-[11px] font-black text-white uppercase tracking-widest">{user}</span>
             <p className="text-[10px] text-white/30 font-bold uppercase italic">{action} <span className="text-white/60">{target}</span></p>
          </div>
       </div>
       <span className="text-[9px] font-bold text-white/20 uppercase">{time}</span>
    </div>
  );
}
