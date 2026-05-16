'use client';

import React from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Swords, Target, Brain, Trophy, Zap } from "lucide-react";
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

import { toast } from "sonner";

export default function ChallengesPage() {
  const handlePlay = (game: string) => {
    toast.info("Iniciando desafio...", {
      description: `Carregando arena de ${game}...`,
    });
  };

  return (
    <div className="pb-32 pt-24 px-4 max-w-5xl mx-auto space-y-10">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-black italic">DESAFIOS</h1>
        <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-2">Vença partidas e ganhe recompensas épicas</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          { title: 'ARENA DE PÊNALTIS', desc: 'Acerte o ângulo e vença o goleiro.', reward: '100 COINS', icon: <Target size={32} />, color: 'primary', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600' },
          { title: 'QUIZ DA COPA', desc: 'Prove que você sabe tudo sobre a Copa.', reward: '20 GEMS', icon: <Brain size={32} />, color: 'secondary', img: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=600' },
          { title: 'BATALHA PVP', desc: 'Desafie seus amigos em tempo real.', reward: 'PACK RARO', icon: <Swords size={32} />, color: 'gold', img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=600' },
          { title: 'EVENTO FLASH', desc: 'Apenas 24h: Ganhe cartas exclusivas.', reward: 'ULTIMATE PACK', icon: <Zap size={32} />, color: 'success', img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&q=80&w=600' },
        ].map((item) => (
          <motion.div 
            key={item.title} 
            whileHover={{ y: -10, scale: 1.02 }}
            className="glass rounded-[40px] overflow-hidden border border-white/5 relative group cursor-pointer h-[320px] shadow-2xl"
          >
            <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-4">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-2xl",
                item.color === 'primary' ? "bg-primary text-white" : 
                item.color === 'secondary' ? "bg-secondary text-white" :
                item.color === 'gold' ? "bg-gold text-black" : "bg-success text-white"
              )}>
                {item.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tight leading-none mb-2">{item.title}</h3>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">{item.desc}</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">RECOMPENSA</span>
                  <span className="text-sm font-black text-white italic">{item.reward}</span>
                </div>
                <button 
                  onClick={() => handlePlay(item.title)}
                  className="bg-white text-black font-black text-[10px] px-8 py-3 rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest active:scale-95 shadow-xl"
                >
                  JOGAR
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Header />
      <BottomNav />
    </div>
  );
}
