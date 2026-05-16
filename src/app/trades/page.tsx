'use client';

import React from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ArrowLeftRight, History, MessageSquare, Check, X } from "lucide-react";
import { MOCK_PLAYERS } from "@/lib/mock-data";
import { StickerCard } from "@/components/game/StickerCard";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { toast } from "sonner";

export default function TradesPage() {
  const handleAction = (type: 'accept' | 'decline') => {
    if (type === 'accept') {
      toast.success("Troca aceita!", {
        description: "A nova carta foi adicionada ao seu álbum.",
      });
    } else {
      toast.error("Troca recusada", {
        description: "A proposta foi removida.",
      });
    }
  };

  return (
    <div className="bg-background min-h-screen text-white font-outfit selection:bg-primary/30">
      <Header />
      
      <main className="pb-40 pt-32 md:pt-40 px-4 md:px-8 max-w-[1400px] mx-auto space-y-12">
        {/* TITULO PADRONIZADO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16"
        >
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black italic uppercase font-bebas tracking-wider leading-none">
              Painel de <span className="text-primary">Trocas</span>
            </h1>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] italic">Negociações pendentes e histórico de transações</p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white font-black py-4 px-8 rounded-xl shadow-glow transition-all active:scale-95 flex items-center gap-3 text-xs uppercase tracking-widest italic">
            <ArrowLeftRight size={18} />
            NOVA PROPOSTA
          </button>
        </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Trades */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black italic flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl">
              <MessageSquare className="text-primary" size={24} />
            </div>
            PROPOSTAS RECEBIDAS
          </h3>
          
          <div className="space-y-4">
            {[
              { from: 'Pedro_01', offer: MOCK_PLAYERS[2], want: MOCK_PLAYERS[0], time: 'Há 2 horas' },
              { from: 'Gamer_X', offer: MOCK_PLAYERS[3], want: MOCK_PLAYERS[1], time: 'Há 5 minutos' },
            ].map((trade, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 5 }}
                className="glass rounded-[32px] p-6 border border-white/5 flex flex-col md:flex-row items-center gap-8 group"
              >
                <div className="flex items-center justify-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="w-20">
                    <StickerCard player={trade.offer} className="scale-90" />
                    <p className="text-[8px] text-center mt-2 font-black text-success uppercase italic">OFERECE</p>
                  </div>
                  
                  <div className="p-2 bg-primary/20 rounded-full text-primary border border-primary/20">
                    <ArrowLeftRight size={24} />
                  </div>

                  <div className="w-20">
                    <StickerCard player={trade.want} className="scale-90 opacity-40 grayscale" />
                    <p className="text-[8px] text-center mt-2 font-black text-danger uppercase italic">PEDE</p>
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black">{trade.from[0]}</div>
                    <h4 className="text-sm font-black italic">{trade.from}</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest">{trade.time}</p>
                </div>

                <div className="flex md:flex-col gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleAction('accept')}
                    className="flex-1 bg-success hover:bg-success/90 text-white p-4 rounded-2xl shadow-lg active:scale-90 transition-all"
                  >
                    <Check size={20} className="mx-auto" />
                  </button>
                  <button 
                    onClick={() => handleAction('decline')}
                    className="flex-1 bg-danger hover:bg-danger/90 text-white p-4 rounded-2xl shadow-lg active:scale-90 transition-all"
                  >
                    <X size={20} className="mx-auto" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="space-y-6">
          <h3 className="text-xl font-black italic flex items-center gap-3">
            <div className="p-2 bg-secondary/20 rounded-xl">
              <History className="text-secondary" size={24} />
            </div>
            HISTÓRICO
          </h3>
          <div className="glass rounded-[32px] p-6 border border-white/5 space-y-6 bg-surface/50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 font-black text-xs uppercase">U{i}</div>
                  <div>
                    <p className="text-xs font-black italic">Usuário_{i}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">CONCLUÍDA</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-success italic">+200 XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>

        </main>
        <BottomNav />
      </div>
    );
}
