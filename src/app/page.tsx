'use client';

import React from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
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
import { cn } from '@/lib/utils';

export default function Home() {
  const trendingPlayers = MOCK_PLAYERS.slice(0, 4);
  const featuredPlayer = MOCK_PLAYERS[0];

  return (
    <div className="bg-[#060608] min-h-screen text-white font-outfit selection:bg-primary/30">
      <Header />
      
      <main className="pb-40 pt-10 lg:pt-36">
        {/* CINEMATIC HERO */}
        <section className="px-4 md:px-8 max-w-[1600px] mx-auto mb-20">
           <div className="relative rounded-[40px] md:rounded-[64px] overflow-hidden bg-[#0a0a0c] border border-white/5 shadow-2xl">
              {/* Atmosferic BG */}
              <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[120%] bg-primary/10 blur-[180px] rounded-full opacity-40" />
                 <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[100%] bg-secondary/10 blur-[150px] rounded-full opacity-30" />
              </div>

              <div className="relative z-10 grid lg:grid-cols-2 items-center gap-12 p-8 md:p-24">
                 <div className="space-y-12">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full"
                    >
                       <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 italic">Temporada Oficial 2026</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-8"
                    >
                       <h1 className="text-7xl md:text-9xl xl:text-[10rem] font-black italic uppercase leading-[0.75] tracking-tight font-bebas">
                          FIFA <br />
                          <span className="text-primary drop-shadow-[0_0_50px_rgba(245,158,11,0.3)]">2026</span>
                       </h1>
                       <p className="text-white/40 text-base md:text-xl font-bold leading-relaxed max-w-lg">
                          A experiência definitiva do álbum digital. Colecione, troque e domine o ranking mundial dos maiores craques do planeta.
                       </p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-wrap gap-6"
                    >
                       <Link 
                         href="/packs" 
                         className="group px-10 md:px-16 py-6 md:py-8 bg-primary text-black font-black rounded-3xl text-xs uppercase tracking-[0.3em] italic hover:scale-105 active:scale-95 transition-all shadow-gold-glow flex items-center gap-4"
                       >
                          Abrir Packs
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                       </Link>
                    </motion.div>
                 </div>

                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.3 }}
                   className="relative flex justify-center lg:justify-end"
                 >
                    <div className="relative group">
                       <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full scale-125 opacity-30 group-hover:opacity-60 transition-opacity" />
                       <StickerCard 
                         player={featuredPlayer} 
                         isOwned={true} 
                         isGolden={true}
                         className="w-[280px] md:w-[380px] z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,1)]" 
                       />
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* MINIMALIST STATS */}
        <section className="px-4 md:px-8 max-w-[1600px] mx-auto mb-32">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <StatItem label="Ativos" value="2.4k" color="text-gold" />
              <StatItem label="Mercado" value="1.2M" color="text-secondary" />
              <StatItem label="Progresso" value="48%" color="text-accent" />
              <StatItem label="Nível" value="Lvl 15" color="text-white" />
           </div>
        </section>

        {/* TRENDING SECTION */}
        <section className="px-4 md:px-8 max-w-[1600px] mx-auto mb-40">
           <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b border-white/5 pb-8">
              <div className="space-y-4">
                 <h2 className="text-6xl font-black italic uppercase font-bebas tracking-wider leading-none">Tendências</h2>
                 <p className="text-white/30 text-sm font-bold uppercase tracking-widest italic">Os cards mais desejados do mercado global</p>
              </div>
              <Link href="/marketplace" className="text-[10px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-3 hover:gap-5 transition-all mb-2">
                 Ver Mercado Inteiro <ArrowRight size={14} />
              </Link>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {trendingPlayers.map((player) => (
                <motion.div 
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <StickerCard player={player} isOwned={true} />
                </motion.div>
              ))}
           </div>
        </section>

        {/* ACTIVITY STRIP */}
        <section className="bg-white/2 py-20 border-y border-white/5">
           <div className="px-4 md:px-8 max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-20">
              <div className="space-y-12">
                 <h2 className="text-5xl font-black italic uppercase font-bebas tracking-wider">Histórico Real-Time</h2>
                 <div className="space-y-6">
                    <ActivityLog user="Caio" action="Obteve" target="Vini Jr." time="2m" />
                    <ActivityLog user="Elena" action="Vendeu" target="Messi" time="5m" />
                    <ActivityLog user="Pedro" action="Abriu" target="Pack Elite" time="12m" />
                 </div>
              </div>
              
              <div className="relative group cursor-pointer">
                 <div className="absolute inset-0 bg-primary/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-all rounded-full" />
                 <div className="relative bg-[#0f172a] rounded-[48px] p-12 border border-white/5 overflow-hidden">
                    <div className="relative z-10 space-y-6">
                       <h3 className="text-3xl font-black italic uppercase font-bebas">Desafio Diário</h3>
                       <p className="text-white/40 text-lg font-bold">Complete a seleção do Brasil para ganhar 5.000 moedas e um Pack Lendário.</p>
                       <button className="px-10 py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                          Ver Detalhes
                       </button>
                    </div>
                    <Trophy className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
                 </div>
              </div>
           </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function StatItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-white/2 p-10 rounded-[40px] border border-white/5 hover:border-white/10 transition-all group">
       <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] block mb-4">{label}</span>
       <span className={cn("text-5xl font-black italic font-bebas tracking-wider block", color)}>{value}</span>
    </div>
  );
}

function ActivityLog({ user, action, target, time }: { user: string, action: string, target: string, time: string }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white/3 rounded-3xl border border-white/5 hover:bg-white/5 transition-all">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
             <User size={18} className="text-primary" />
          </div>
          <div>
             <span className="text-[11px] font-black text-white uppercase tracking-widest">{user}</span>
             <p className="text-[10px] text-white/30 font-bold uppercase">{action} <span className="text-white/60">{target}</span></p>
          </div>
       </div>
       <span className="text-[9px] font-bold text-white/20 uppercase">{time}</span>
    </div>
  );
}
