'use client';

import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Swords, Target, Brain, Zap, X, Trophy, Clock } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { QuizChallenge } from '@/components/game/QuizChallenge';

type ChallengeId = 'quiz' | 'penalty' | 'pvp' | 'flash' | null;

const CHALLENGES = [
  {
    id: 'quiz' as ChallengeId,
    title: 'QUIZ DA COPA',
    desc: 'Prove que você sabe tudo sobre a Copa do Mundo.',
    reward: '150 Coins + 5 Gems',
    icon: Brain,
    color: '#a855f7',
    img: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=600',
    playable: true,
    duration: '~2 min',
  },
  {
    id: 'penalty' as ChallengeId,
    title: 'ARENA DE PÊNALTIS',
    desc: 'Acerte o ângulo e vença o goleiro. Em breve!',
    reward: '100 Coins',
    icon: Target,
    color: '#3b82f6',
    img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600',
    playable: false,
    duration: '~3 min',
  },
  {
    id: 'pvp' as ChallengeId,
    title: 'BATALHA PVP',
    desc: 'Desafie outros colecionadores em tempo real. Em breve!',
    reward: 'Pack Raro',
    icon: Swords,
    color: '#fbbf24',
    img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=600',
    playable: false,
    duration: '~5 min',
  },
  {
    id: 'flash' as ChallengeId,
    title: 'EVENTO FLASH',
    desc: 'Apenas 24h: Ganhe cartas exclusivas. Em breve!',
    reward: 'Ultimate Pack',
    icon: Zap,
    color: '#22c55e',
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&q=80&w=600',
    playable: false,
    duration: '~10 min',
  },
];

export default function ChallengesPage() {
  const [active, setActive] = useState<ChallengeId>(null);

  const handlePlay = (id: ChallengeId, playable: boolean) => {
    if (!playable) {
      toast.info('Em breve!', { description: 'Este desafio ainda está sendo preparado.' });
      return;
    }
    setActive(id);
  };

  const handleFinish = (won: boolean, score: number) => {
    setActive(null);
    if (won) {
      toast.success('🏆 Parabéns! Você venceu!', { description: `${score}/5 acertos · +150 Coins +5 Gems adicionados!` });
    } else {
      toast.info(`Você acertou ${score}/5`, { description: 'Precisa de 3+ para ganhar. Tente novamente!' });
    }
  };

  return (
    <>
      {/* Quiz fullscreen overlay */}
      <AnimatePresence>
        {active === 'quiz' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background"
          >
            {/* Botão fechar */}
            <button
              onClick={() => setActive(null)}
              className="absolute top-4 right-4 z-50 p-3 bg-white/5 hover:bg-white/15 rounded-full border border-white/10 text-white/50 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
            <QuizChallenge onFinish={handleFinish} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-background min-h-screen text-white font-outfit selection:bg-primary/30">
        <Header />

        <main className="pb-40 pt-32 md:pt-40 px-4 md:px-8 max-w-[1400px] mx-auto space-y-12">
          {/* Título */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-black italic uppercase font-bebas tracking-wider leading-none">
              Arena de <span className="text-primary">Desafios</span>
            </h1>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] italic">Vença partidas e ganhe recompensas épicas</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {CHALLENGES.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="relative rounded-[2rem] overflow-hidden border border-white/5 group cursor-pointer h-[300px] shadow-2xl"
                onClick={() => handlePlay(item.id, item.playable)}
                style={{ boxShadow: item.playable ? `0 0 40px ${item.color}20` : undefined }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className={cn(
                    'absolute inset-0 w-full h-full object-cover transition-all duration-700',
                    item.playable
                      ? 'opacity-35 group-hover:opacity-55 group-hover:scale-105'
                      : 'opacity-15 grayscale'
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Badge "Em Breve" */}
                {!item.playable && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white/40">
                    Em Breve
                  </div>
                )}

                {/* Badge "Jogar" */}
                {item.playable && (
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-black"
                    style={{ background: item.color }}
                  >
                    ▶ Disponível
                  </div>
                )}

                <div className="absolute inset-0 p-7 flex flex-col justify-end space-y-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl mb-1"
                    style={{ background: `${item.color}25`, border: `1px solid ${item.color}40` }}
                  >
                    <item.icon size={26} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tight leading-none mb-1">{item.title}</h3>
                    <p className="text-xs text-white/40 font-medium">{item.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">RECOMPENSA</span>
                      <span className="text-sm font-black italic" style={{ color: item.color }}>{item.reward}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-white/30">
                        <Clock size={11} />
                        <span className="text-[9px] font-bold">{item.duration}</span>
                      </div>
                      <button
                        className="font-black text-[10px] px-6 py-2.5 rounded-xl uppercase tracking-widest transition-all active:scale-95 shadow-xl"
                        style={item.playable
                          ? { background: item.color, color: '#000' }
                          : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)' }
                        }
                      >
                        {item.playable ? 'JOGAR' : 'BLOQUEADO'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Ranking placeholder */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Trophy size={20} className="text-primary" />
              <h3 className="text-xl font-black italic uppercase font-bebas tracking-wider text-white">Ranking da Semana</h3>
            </div>
            <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Complete desafios para aparecer aqui • Em breve</p>
          </div>
        </main>

        <BottomNav />
      </div>
    </>
  );
}
