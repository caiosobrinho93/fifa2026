import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type Profile = {
  id: string;
  username: string;
  avatar_url?: string;
  coins: number;
  gems: number;
  updated_at: string;
};

export type UserCard = {
  id: string;
  user_id: string;
  player_id: string;
  quantity: number;
  is_pasted: boolean;
  is_shiny: boolean;
  created_at: string;
};

export type Player = {
  id: string;
  name: string;
  country: string;
  position: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  overall: number;
  image_url: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    pass: number;
    dribble: number;
    physical: number;
  };
};
