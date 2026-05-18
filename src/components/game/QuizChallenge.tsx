'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Trophy, Coins, ArrowRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const QUESTIONS = [
  { q: 'Quantas Copas do Mundo o Brasil ganhou?', options: ['4', '5', '6', '3'], answer: 1 },
  { q: 'Onde será realizada a Copa do Mundo 2026?', options: ['Qatar', 'Europa', 'EUA, México e Canadá', 'Brasil'], answer: 2 },
  { q: 'Qual jogador tem mais gols na história da Copa?', options: ['Pelé', 'Ronaldo', 'Miroslav Klose', 'Messi'], answer: 2 },
  { q: 'Quantas seleções participam da Copa 2026?', options: ['32', '48', '36', '40'], answer: 1 },
  { q: 'Qual país ganhou a Copa de 2022 no Qatar?', options: ['França', 'Brasil', 'Argentina', 'Croácia'], answer: 2 },
];

const REWARDS = { coins: 150, gems: 5 };
const TIME_PER_Q = 12;

interface QuizChallengeProps {
  onFinish: (won: boolean, score: number) => void;
}

export function QuizChallenge({ onFinish }: QuizChallengeProps) {
  const [phase, setPhase]     = useState<'intro' | 'playing' | 'result'>('intro');
  const [qIdx, setQIdx]       = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore]     = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));

  const q = QUESTIONS[qIdx];

  const advance = useCallback((picked: number | null) => {
    const correct = picked === q.answer;
    const newScore = correct ? score + 1 : score;
    const newAnswers = [...answers];
    newAnswers[qIdx] = picked;
    setAnswers(newAnswers);
    setScore(newScore);
    setSelected(picked);

    setTimeout(() => {
      if (qIdx < QUESTIONS.length - 1) {
        setQIdx(qIdx + 1);
        setSelected(null);
        setTimeLeft(TIME_PER_Q);
      } else {
        setPhase('result');
        onFinish(newScore >= 3, newScore);
      }
    }, 900);
  }, [q, score, qIdx, answers, onFinish]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || selected !== null) return;
    if (timeLeft <= 0) { advance(null); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, selected, advance]);

  const startQuiz = () => {
    setPhase('playing');
    setQIdx(0);
    setScore(0);
    setSelected(null);
    setTimeLeft(TIME_PER_Q);
    setAnswers(Array(QUESTIONS.length).fill(null));
  };

  const timerPct = (timeLeft / TIME_PER_Q) * 100;
  const won = score >= 3;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-outfit">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">

          {/* ── INTRO ── */}
          {phase === 'intro' && (
            <motion.div key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="text-center space-y-8"
            >
              <div className="space-y-3">
                <div className="text-6xl">🧠</div>
                <h1 className="text-5xl font-black italic uppercase font-bebas text-white tracking-wider">Quiz da Copa</h1>
                <p className="text-white/40 text-sm">5 perguntas · 12 segundos cada · Acerte 3+ para ganhar</p>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Recompensa</span>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Coins size={20} />
                    <span className="text-2xl font-black italic font-bebas">{REWARDS.coins} Coins</span>
                  </div>
                  <div className="text-white/20">+</div>
                  <div className="flex items-center gap-2 text-purple-400">
                    <span className="text-2xl">💎</span>
                    <span className="text-2xl font-black italic font-bebas">{REWARDS.gems} Gems</span>
                  </div>
                </div>
              </div>

              <button
                onClick={startQuiz}
                className="w-full py-5 rounded-2xl bg-primary text-black font-black italic uppercase tracking-widest text-base flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg shadow-primary/30"
              >
                Começar Desafio <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {/* ── PLAYING ── */}
          {phase === 'playing' && (
            <motion.div key={`q-${qIdx}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ type: 'spring', damping: 20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white/40 uppercase tracking-widest">
                  {qIdx + 1} / {QUESTIONS.length}
                </span>
                <div className={cn(
                  'flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-sm transition-colors',
                  timeLeft <= 4 ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/60'
                )}>
                  <Clock size={14} />
                  {timeLeft}s
                </div>
              </div>

              {/* Timer bar */}
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${timerPct}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full transition-colors"
                  style={{ background: timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444' }}
                />
              </div>

              {/* Pergunta */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <p className="text-xl font-black text-white leading-snug">{q.q}</p>
              </div>

              {/* Opções */}
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect  = i === q.answer;
                  const revealed   = selected !== null;
                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.96 }}
                      disabled={selected !== null}
                      onClick={() => advance(i)}
                      className={cn(
                        'p-4 rounded-xl border text-sm font-bold text-left transition-all',
                        !revealed && 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20 text-white',
                        revealed && isCorrect && 'bg-emerald-900/50 border-emerald-500/60 text-emerald-300',
                        revealed && isSelected && !isCorrect && 'bg-red-900/50 border-red-500/60 text-red-300',
                        revealed && !isSelected && !isCorrect && 'opacity-30 border-white/5 text-white/30',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                        {revealed && isCorrect && <CheckCircle2 size={14} className="ml-auto text-emerald-400 shrink-0" />}
                        {revealed && isSelected && !isCorrect && <XCircle size={14} className="ml-auto text-red-400 shrink-0" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Score parcial */}
              <div className="flex justify-center gap-2">
                {answers.map((a, i) => (
                  <div key={i} className={cn(
                    'w-2.5 h-2.5 rounded-full',
                    i > qIdx ? 'bg-white/10' :
                    a === null ? 'bg-red-500' :
                    a === QUESTIONS[i].answer ? 'bg-emerald-500' : 'bg-red-500'
                  )} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {phase === 'result' && (
            <motion.div key="result"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-7xl"
              >
                {won ? '🏆' : '😅'}
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-5xl font-black italic uppercase font-bebas text-white">
                  {won ? 'Você Venceu!' : 'Tente Novamente'}
                </h2>
                <p className="text-white/40 text-sm">
                  {score} de {QUESTIONS.length} acertos
                </p>
              </div>

              {/* Score visual */}
              <div className="flex justify-center gap-3">
                {QUESTIONS.map((_, i) => (
                  <div key={i} className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-black',
                    answers[i] === QUESTIONS[i].answer ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' : 'bg-red-500/20 border border-red-500/40 text-red-400'
                  )}>
                    {answers[i] === QUESTIONS[i].answer ? '✓' : '✗'}
                  </div>
                ))}
              </div>

              {/* Recompensa */}
              {won && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6 space-y-2"
                >
                  <p className="text-amber-400/60 text-[10px] font-black uppercase tracking-widest">🎁 Recompensa Recebida</p>
                  <div className="flex items-center justify-center gap-6">
                    <span className="text-3xl font-black italic font-bebas text-amber-400">+{REWARDS.coins} Coins</span>
                    <span className="text-white/20">·</span>
                    <span className="text-3xl font-black italic font-bebas text-purple-400">+{REWARDS.gems} Gems</span>
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col gap-3">
                {!won && (
                  <button
                    onClick={startQuiz}
                    className="w-full py-4 rounded-2xl bg-primary text-black font-black italic uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                  >
                    Tentar Novamente <ArrowRight size={18} />
                  </button>
                )}
                <Link
                  href="/challenges"
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white font-black italic uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  <Home size={16} />
                  Voltar à Arena
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
