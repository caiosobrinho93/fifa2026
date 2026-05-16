export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type CardType = 'player' | 'special';

export interface CardStats {
  attack: number;
  defense: number;
  speed: number;
  dribble: number;
  pass: number;
  physical: number;
}

// Card master - todos os cards que existem no sistema
export interface Card {
  id: string;
  name: string;
  description?: string;
  type: CardType;
  country?: string;
  position?: string;
  number?: number;
  overall: number;
  stars: number; // 1 to 5
  rarity: Rarity;
  stats: CardStats;
  image_url?: string;
  is_golden: boolean;
  probability: number; // Chance de sair no pack (ex: 0.01 = 1%)
  dust_reward: number; // Poeira ganha ao destruir
  created_at: string;
  has_essence?: boolean; // Para compatibilidade
}

// Para compatibilidade com código antigo - Player = Card
export type Player = Card;

// User - dados do usuário
export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  level: number;
  xp: number;
  coins: number;
  gems: number;
  dust: number; // Po estrala para crafting
  is_vip: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// Card que o usuário possui
export interface UserCard {
  id: string;
  user_id: string;
  card_id: string;
  quantity?: number;
  is_pasted?: boolean;
  acquired_at: string;
  card?: Card;
  // Para compatibilidade com código antigo
  player_id?: string;
  is_shiny?: boolean;
  is_locked?: boolean;
  is_golden?: boolean;
  has_essence?: boolean;
}

// Pack - definição de pacotes
export interface Pack {
  id: string;
  name: string;
  description?: string;
  price_coins?: number;
  price_gems?: number;
  card_count: number;
  image_url?: string;
  rarity: Rarity;
  probabilities?: Record<Rarity, number>; // Para compatibilidade
}

// Marketplace listing
export interface MarketplaceListing {
  id: string;
  seller_id: string;
  card_id: string;
  quantity: number;
  price: number;
  currency: 'coins' | 'gems';
  status: 'active' | 'sold' | 'cancelled';
  created_at: string;
  card?: Card;
  seller?: User;
}

// Transaction - histórico de transações
export interface Transaction {
  id: string;
  user_id: string;
  type: 'purchase' | 'sale' | 'pack_open' | 'reward' | 'gift' | 'destroy';
  amount: number;
  currency: 'coins' | 'gems' | 'dust';
  description?: string;
  reference_id?: string;
  created_at: string;
}

// Album - álbum para completar
export interface Album {
  id: string;
  name: string;
  description?: string;
  required_cards: string[]; // Array de card_ids
  reward_coins: number;
  reward_gems: number;
  reward_dust: number;
  bg_color?: string; // Tailwind gradient classes
  theme_image?: string; // URL for background/header
}

// User Album - progresso do usuário
export interface UserAlbum {
  id: string;
  user_id: string;
  album_id: string;
  pasted_cards: string[];
  completed: boolean;
  completed_at?: string;
  album?: Album;
}

// Mission
export interface Mission {
  id: string;
  title: string;
  description?: string;
  reward_coins: number;
  reward_gems: number;
  reward_dust: number;
  reward_xp: number;
  type: 'daily' | 'weekly' | 'achievement';
  goal_type: string;
  goal_count: number;
}

// User Mission
export interface UserMission {
  id: string;
  user_id: string;
  mission_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
  mission?: Mission;
}