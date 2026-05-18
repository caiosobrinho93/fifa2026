'use client';

import React from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { User, Settings, LogOut, Shield, Award, Clock, Package } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useInventory } from '@/contexts/InventoryContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { totalCards, uniqueCards } = useInventory();
  const router = useRouter();

  if (!user) {
    return (
      <div className="bg-background min-h-screen text-white flex flex-col items-center justify-center p-8 text-center space-y-6">
        <h1 className="text-4xl font-black font-bebas italic uppercase tracking-wider">Acesso Negado</h1>
        <p className="text-white/40 uppercase text-xs tracking-widest">Você precisa estar logado para ver seu perfil.</p>
      </div>
    );
  }

  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'Player';
  const level    = user.user_metadata?.level ?? 1;
  const coins    = user.user_metadata?.coins ?? 0;
  const gems     = user.user_metadata?.gems  ?? 0;
  const initials = username.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="bg-background min-h-screen text-white font-outfit">
      <Header />

      <main className="pb-40 pt-32 md:pt-40 px-4 md:px-8 max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-[350px_1fr] gap-8"
        >
          {/* Sidebar — Card do perfil */}
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 text-center space-y-6 backdrop-blur-xl relative overflow-hidden">
              {/* Barra de topo colorida */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />

              {/* Avatar com iniciais */}
              <div className="relative w-28 h-28 mx-auto">
                <div
                  className="w-full h-full rounded-2xl flex items-center justify-center text-4xl font-black text-black shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
                >
                  {initials}
                </div>
                {/* Badge de nível */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center border-4 border-background text-black font-black text-sm italic font-bebas">
                  {level}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-black font-bebas italic uppercase tracking-wider">{username}</h2>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-1">{user.email}</p>
                <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">Nível {level} · Colecionador</p>
              </div>

              {/* Stats reais */}
              <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Cards Únicos</span>
                  <p className="text-2xl font-black font-bebas italic text-white">{uniqueCards}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Total Cards</span>
                  <p className="text-2xl font-black font-bebas italic text-white">{totalCards}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Coins</span>
                  <p className="text-2xl font-black font-bebas italic text-amber-400">{coins.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Gems</span>
                  <p className="text-2xl font-black font-bebas italic text-purple-400">{gems}</p>
                </div>
              </div>
            </div>

            {/* Navegação */}
            <nav className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
              {[
                { icon: Package,  label: 'Inventário',    href: '/inventory' },
                { icon: Award,    label: 'Conquistas',    href: null },
                { icon: Clock,    label: 'Histórico',     href: null },
                { icon: Shield,   label: 'Segurança',     href: null },
                { icon: Settings, label: 'Configurações', href: null },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => item.href ? router.push(item.href) : undefined}
                  className="w-full px-8 py-5 flex items-center gap-4 text-white/40 hover:text-white hover:bg-white/5 transition-all border-b border-white/5 last:border-0 group"
                >
                  <item.icon size={18} className="group-hover:text-primary transition-colors shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full px-8 py-6 flex items-center gap-4 text-red-500/60 hover:text-red-400 hover:bg-red-500/5 transition-all"
              >
                <LogOut size={18} className="shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest">Sair da Conta</span>
              </button>
            </nav>
          </div>

          {/* Main */}
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-xl min-h-[400px]">
              <h3 className="text-2xl font-black font-bebas italic uppercase tracking-wider mb-8 flex items-center gap-3">
                <Award className="text-primary" />
                Atividades Recentes
              </h3>
              {totalCards === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-30">
                  <User size={48} className="text-white/20" />
                  <p className="text-white italic text-sm text-center">
                    Nenhuma atividade ainda.<br />Abra packs para começar sua aventura!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                    <Package size={18} className="text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-white">Coleção iniciada</p>
                      <p className="text-xs text-white/30">{uniqueCards} cards únicos · {totalCards} no total</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
