'use client';

import React from 'react';
import { StickerCard } from '@/components/game/StickerCard';
import { Player } from '@/types/game';

const DEMO_PLAYER: Player = {
  id: 'test-p1',
  name: 'Lionel Messi',
  overall: 94,
  country: 'Argentina',
  position: 'RW',
  image_url: 'https://b.fssta.com/wp-content/uploads/2022/12/lionel-messi.png',
  stars: 5,
  type: 'player',
  is_golden: true,
  probability: 0.005,
  dust_reward: 500,
  created_at: new Date().toISOString(),
  stats: {
    attack: 95,
    defense: 45,
    speed: 85,
    dribble: 96,
    pass: 94,
    physical: 65
  },
  rarity: 'legendary'
};

export default function ConceptsPage() {
  return (
    <div className="min-h-screen bg-[#050505] py-20 px-6">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter font-bebas">
          Final <span className="text-amber-400">Legendary Look</span>
        </h1>
        <p className="text-white/40 mt-4 max-w-2xl mx-auto uppercase tracking-widest text-xs">
          Visual Minimalista: Partículas Frontais + Brilho Dourado
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex justify-center">
        <div className="w-full max-w-[400px] aspect-[2/3]">
           <StickerCard player={DEMO_PLAYER} />
        </div>
      </div>

      <div className="mt-20 p-8 border border-white/5 bg-white/5 rounded-2xl text-center max-w-2xl mx-auto">
        <h4 className="text-white font-bold mb-2 uppercase font-bebas">Elegância e Poder</h4>
        <p className="text-white/40 text-xs leading-relaxed">
          Removemos o fogo traseiro para focar na limpeza do design. As partículas frontais dão o toque mágico necessário sem poluir o visual do atleta.
        </p>
      </div>
    </div>
  );
}
