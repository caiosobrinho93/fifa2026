'use client';

import React from 'react';
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { User, Settings, LogOut, Shield, Award, Clock } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_USER } from '@/lib/mock-data';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const currentUser = user ? MOCK_USER : null;

  if (!currentUser) {
    return (
      <div className="bg-background min-h-screen text-white flex flex-col items-center justify-center p-8 text-center space-y-6">
        <h1 className="text-4xl font-black font-bebas italic uppercase tracking-wider">Acesso Negado</h1>
        <p className="text-white/40 uppercase text-xs tracking-widest">Você precisa estar logado para ver seu perfil.</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-white font-outfit">
      <Header />
      
      <main className="pb-40 pt-32 md:pt-40 px-4 md:px-8 max-w-[1200px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-[350px_1fr] gap-8"
        >
          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 text-center space-y-6 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-primary" />
              
              <div className="w-32 h-32 mx-auto rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center relative group">
                <User size={64} className="text-white/20" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-lg flex items-center justify-center border-4 border-background text-black font-black italic">
                   {currentUser.level}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-black font-bebas italic uppercase tracking-wider">{currentUser.username}</h2>
                <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">Colecionador Elite</p>
              </div>

              <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Cards</span>
                   <p className="text-xl font-black font-bebas italic">1,240</p>
                 </div>
                 <div className="space-y-1">
                   <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Ranking</span>
                   <p className="text-xl font-black font-bebas italic">#42</p>
                 </div>
              </div>
            </div>

            <nav className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
               {[
                 { icon: Settings, label: 'Configurações' },
                 { icon: Shield, label: 'Segurança' },
                 { icon: Award, label: 'Conquistas' },
                 { icon: Clock, label: 'Histórico' },
               ].map((item, i) => (
                 <button key={i} className="w-full px-8 py-5 flex items-center gap-4 text-white/40 hover:text-white hover:bg-white/5 transition-all border-b border-white/5 last:border-0 group">
                   <item.icon size={20} className="group-hover:text-primary transition-colors" />
                   <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                 </button>
               ))}
               <button 
                 onClick={() => signOut()}
                 className="w-full px-8 py-6 flex items-center gap-4 text-red-500/60 hover:text-red-400 hover:bg-red-500/5 transition-all"
               >
                 <LogOut size={20} />
                 <span className="text-xs font-bold uppercase tracking-widest">Sair da Conta</span>
               </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-xl min-h-[400px]">
               <h3 className="text-2xl font-black font-bebas italic uppercase tracking-wider mb-8 flex items-center gap-3">
                 <Award className="text-primary" />
                 Atividades Recentes
               </h3>
               
               <div className="space-y-4 opacity-30 italic text-sm text-center py-20">
                 Nenhuma atividade registrada hoje.
               </div>
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
