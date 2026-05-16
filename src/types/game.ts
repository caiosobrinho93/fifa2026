export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface PlayerStats {
  attack: number;
  defense: number;
  speed: number;
  dribble: number;
  pass: number;
  physical: number;
}

export interface Player {
  id: string;
  name: string;
  country: string;
  position: string;
  number: number;
  overall: number;
  stats: PlayerStats;
  rarity: Rarity;
  image_url?: string;
  created_at: string;
}

export interface UserCard {
  id: string;
  user_id: string;
  player_id: string;
  is_shiny: boolean;
  is_locked: boolean;
  is_golden: boolean;
  is_pasted: boolean;
  quantity: number;
  acquired_at: string;
  player?: Player; // Joined data
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  price_coins: number;
  price_gems: number;
  card_count: number;
  probabilities: Record<Rarity, number>;
  image_url?: string;
  rarity: Rarity;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  level: number;
  xp: number;
  coins: number;
  gems: number;
  is_vip: boolean;
  created_at: string;
}

export interface MarketplaceListing {
  id: string;
  seller_id: string;
  card_id: string;
  price: number;
  currency: 'coins' | 'gems';
  status: 'active' | 'sold' | 'cancelled';
  created_at: string;
  card?: UserCard; // Joined data
  seller?: UserProfile; // Joined data
}
