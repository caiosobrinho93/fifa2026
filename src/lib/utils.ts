import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function getRarityColor(rarity: string) {
  switch (rarity) {
    case 'common': return 'text-slate-400 border-slate-400';
    case 'rare': return 'text-blue-400 border-blue-400';
    case 'epic': return 'text-purple-400 border-purple-400';
    case 'legendary': return 'text-gold border-gold shadow-gold-glow';
    case 'mythic': return 'text-red-500 border-red-500 animate-pulse';
    default: return 'text-text border-text';
  }
}
