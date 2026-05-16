-- Copa Album 2026 Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 500,
  gems INTEGER DEFAULT 50,
  is_vip BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: players (Master data for all football players)
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  position TEXT NOT NULL,
  number INTEGER,
  overall INTEGER NOT NULL,
  stats JSONB NOT NULL, -- { attack, defense, speed, dribble, pass, physical }
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: packs (Definition of available packs)
CREATE TABLE packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price_coins INTEGER,
  price_gems INTEGER,
  card_count INTEGER DEFAULT 5,
  probabilities JSONB NOT NULL, -- { common: 0.8, rare: 0.15, ... }
  image_url TEXT,
  rarity TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: user_cards (Instances of cards owned by users)
CREATE TABLE user_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  is_shiny BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE, -- To prevent accidental selling/trading
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: marketplace_listings
CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES user_cards(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  currency TEXT DEFAULT 'coins', -- 'coins' or 'gems'
  status TEXT DEFAULT 'active', -- 'active', 'sold', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: trades
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Optional for public trades
  offered_cards UUID[] NOT NULL, -- Array of user_cards.id
  requested_cards UUID[], -- Array of player_id (what they want)
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: wallet_transactions
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL, -- 'coins' or 'gems'
  type TEXT NOT NULL, -- 'purchase', 'sale', 'pack_open', 'reward'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: missions
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  reward_coins INTEGER DEFAULT 0,
  reward_gems INTEGER DEFAULT 0,
  reward_xp INTEGER DEFAULT 0,
  type TEXT DEFAULT 'daily', -- 'daily', 'weekly', 'achievement'
  goal_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, but only edit their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User Cards: Users can read all (for marketplace), but only manage their own
CREATE POLICY "User cards are viewable by everyone" ON user_cards FOR SELECT USING (true);
CREATE POLICY "Users can manage their own cards" ON user_cards FOR ALL USING (auth.uid() = user_id);

-- Marketplace: Everyone can see active listings
CREATE POLICY "Listings are viewable by everyone" ON marketplace_listings FOR SELECT USING (status = 'active');
CREATE POLICY "Users can manage their own listings" ON marketplace_listings FOR ALL USING (auth.uid() = seller_id);

-- Functions & Triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile on auth signup
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
