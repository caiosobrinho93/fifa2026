'use client';

import React, { useState } from 'react';
import { StickerCard, CustomCardConfig } from '@/components/game/StickerCard';
import { Player } from '@/types/game';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Eye, Code, Palette, Layout, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CardEditorPage() {
  const [config, setConfig] = useState<CustomCardConfig>({
    starPosition: 'left',
    overallPosition: 'top-right',
    nameBarHeight: 40,
    nameBarBg: 'rgba(0, 0, 0, 0.6)',
    statsBg: 'rgba(0, 0, 0, 0.4)',
    accentColor: '#3b82f6',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 16,
    overlayOpacity: 0.2,
    fontStyle: 'bebas',
    showFlag: true,
    starsGlow: true
  });

  const previewPlayer: Player = {
    id: 'preview',
    name: 'Lionel Messi',
    image_url: 'https://www.fifarosters.com/assets/players/fifa24/faces/158023.png',
    country: 'Argentina',
    position: 'ATA',
    overall: 94,
    stars: 5,
    type: 'player',
    rarity: 'legendary',
    is_golden: true,
    probability: 0.005,
    dust_reward: 500,
    created_at: new Date().toISOString(),
    stats: { attack: 94, defense: 34, speed: 85, dribble: 96, pass: 94, physical: 65 }
  };

  const [isSaved, setIsSaved] = useState(false);

  const updateConfig = (key: keyof CustomCardConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('custom_card_design', JSON.stringify(config));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "sticker_design.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase font-bebas tracking-widest text-primary">Card Lab <span className="text-white">v1.0</span></h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mt-2">Crie o design perfeito para a sua coleção</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleExport}
              className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all"
            >
              <Code size={14} /> Exportar JSON
            </button>
            <button 
              onClick={handleSave}
              className={cn(
                "px-6 py-2 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]",
                isSaved ? "bg-green-600" : "bg-primary hover:bg-blue-600"
              )}
            >
              {isSaved ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
              {isSaved ? "Design Salvo!" : "Salvar Design"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* CONTROLS */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Layout Section */}
            <section className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Layout className="text-primary" size={20} />
                <h2 className="text-lg font-black uppercase italic font-bebas tracking-wider">Estrutura e Layout</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Posição das Estrelas</label>
                  <select 
                    value={config.starPosition} 
                    onChange={(e) => updateConfig('starPosition', e.target.value)}
                    className="w-full bg-black border border-white/10 p-2 rounded text-sm outline-none focus:border-primary"
                  >
                    <option value="left">Esquerda (Coluna)</option>
                    <option value="right">Direita (Coluna)</option>
                    <option value="top">Topo (Linha)</option>
                    <option value="bottom">Base (Linha)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Posição do Overall</label>
                  <select 
                    value={config.overallPosition} 
                    onChange={(e) => updateConfig('overallPosition', e.target.value)}
                    className="w-full bg-black border border-white/10 p-2 rounded text-sm outline-none focus:border-primary"
                  >
                    <option value="top-left">Topo Esquerda</option>
                    <option value="top-right">Topo Direita</option>
                    <option value="bottom-left">Base Esquerda</option>
                    <option value="bottom-right">Base Direita</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Altura da Barra de Nome: {config.nameBarHeight}px</label>
                <input 
                  type="range" min="30" max="80" value={config.nameBarHeight} 
                  onChange={(e) => updateConfig('nameBarHeight', parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </section>

            {/* Aesthetics Section */}
            <section className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Palette className="text-primary" size={20} />
                <h2 className="text-lg font-black uppercase italic font-bebas tracking-wider">Cores e Estética</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Cor de Destaque (Accent)</label>
                  <div className="flex gap-2">
                    <input type="color" value={config.accentColor} onChange={(e) => updateConfig('accentColor', e.target.value)} className="bg-transparent border-none w-10 h-10 cursor-pointer" />
                    <input type="text" value={config.accentColor} onChange={(e) => updateConfig('accentColor', e.target.value)} className="bg-black border border-white/10 p-2 rounded text-xs w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Cor da Borda</label>
                  <div className="flex gap-2">
                    <input type="color" value={config.borderColor} onChange={(e) => updateConfig('borderColor', e.target.value)} className="bg-transparent border-none w-10 h-10 cursor-pointer" />
                    <input type="text" value={config.borderColor} onChange={(e) => updateConfig('borderColor', e.target.value)} className="bg-black border border-white/10 p-2 rounded text-xs w-full" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Opacidade do Overlay: {Math.round(config.overlayOpacity * 100)}%</label>
                  <input 
                    type="range" min="0" max="1" step="0.1" value={config.overlayOpacity} 
                    onChange={(e) => updateConfig('overlayOpacity', parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Borda Arredondada: {config.borderRadius}px</label>
                  <input 
                    type="range" min="0" max="40" value={config.borderRadius} 
                    onChange={(e) => updateConfig('borderRadius', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </section>

            {/* Typography Section */}
            <section className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Type className="text-primary" size={20} />
                <h2 className="text-lg font-black uppercase italic font-bebas tracking-wider">Tipografia e Extras</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Estilo da Fonte</label>
                  <div className="flex gap-2">
                    {(['bebas', 'mono', 'sans'] as const).map(f => (
                      <button 
                        key={f}
                        onClick={() => updateConfig('fontStyle', f)}
                        className={cn(
                          "flex-1 p-2 border rounded text-xs uppercase font-bold transition-all",
                          config.fontStyle === f ? "bg-primary border-primary text-white" : "bg-black border-white/10 text-white/40"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={config.showFlag} onChange={(e) => updateConfig('showFlag', e.target.checked)} className="hidden" />
                    <div className={cn("w-4 h-4 border rounded flex items-center justify-center transition-all", config.showFlag ? "bg-primary border-primary" : "border-white/20")}>
                      {config.showFlag && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Mostrar Bandeira</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={config.starsGlow} onChange={(e) => updateConfig('starsGlow', e.target.checked)} className="hidden" />
                    <div className={cn("w-4 h-4 border rounded flex items-center justify-center transition-all", config.starsGlow ? "bg-primary border-primary" : "border-white/20")}>
                      {config.starsGlow && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Brilho nas Estrelas</span>
                  </label>
                </div>
              </div>
            </section>

          </div>

          {/* PREVIEW */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-8">
              <div className="mb-4 flex items-center gap-2 text-white/40">
                <Eye size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Preview em Tempo Real</span>
              </div>
              <div className="aspect-[2/3] w-full max-w-[400px] mx-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <StickerCard 
                  player={previewPlayer} 
                  variant="custom" 
                  customConfig={config} 
                  isOwned={true}
                />
              </div>
              <div className="mt-8 bg-black/40 p-4 rounded-xl border border-white/5">
                 <p className="text-white/40 text-[10px] font-mono leading-relaxed">
                   // Design Config Output<br/>
                   const config = {JSON.stringify(config, null, 2).slice(0, 100)}...
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
