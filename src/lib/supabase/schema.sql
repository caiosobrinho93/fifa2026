-- Copa Album 2026 Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 500,
  gems INTEGER DEFAULT 50,
  dust INTEGER DEFAULT 0, -- Po estrala para crafting
  is_vip BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CARDS TABLE (Master Data - todos os cards existentes)
-- ============================================
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'player', -- 'player' ou 'special'
  country TEXT,
  position TEXT,
  number INTEGER,
  overall INTEGER NOT NULL,
  stars INTEGER DEFAULT 1, -- 1 a 5 estrelas
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  stats JSONB DEFAULT '{}', -- { attack, defense, speed, dribble, pass, physical }
  image_url TEXT,
  is_golden BOOLEAN DEFAULT FALSE,
  probability FLOAT DEFAULT 0.01, -- Chance de sair no pack (0.01 = 1%)
  dust_reward INTEGER DEFAULT 10, -- Poeira ganha ao destruir
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER_CARDS TABLE (Relação user -> cards)
-- ============================================
CREATE TABLE user_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  is_pasted BOOLEAN DEFAULT FALSE, -- Se j colado no álbum
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_id) -- Impede duplicata do mesmo card para o mesmo user
);

-- ============================================
-- PACKS TABLE (Definição dos pacotes)
-- ============================================
CREATE TABLE packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price_coins INTEGER,
  price_gems INTEGER,
  card_count INTEGER DEFAULT 5,
  image_url TEXT,
  rarity TEXT NOT NULL, -- raridade minima dos cards no pack
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MARKETPLACE LISTINGS
-- ============================================
CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  price INTEGER NOT NULL,
  currency TEXT DEFAULT 'coins', -- 'coins' ou 'gems'
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRANSACTIONS (Histórico de transações)
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'purchase', 'sale', 'pack_open', 'reward', 'gift', 'destroy'
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL, -- 'coins', 'gems', 'dust'
  description TEXT,
  reference_id UUID, -- ID da referência (ex: pack_id, listing_id)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MISSIONS/ACHIEVEMENTS
-- ============================================
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  reward_coins INTEGER DEFAULT 0,
  reward_gems INTEGER DEFAULT 0,
  reward_dust INTEGER DEFAULT 0,
  reward_xp INTEGER DEFAULT 0,
  type TEXT DEFAULT 'daily', -- 'daily', 'weekly', 'achievement'
  goal_type TEXT, -- 'cards_collected', 'packs_opened', 'trades_completed', etc
  goal_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER MISSIONS (Progresso do usuário)
-- ============================================
CREATE TABLE user_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, mission_id)
);

-- ============================================
-- ALBUMS (Álbuns que o usuário pode completar)
-- ============================================
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  required_cards JSONB NOT NULL, -- Array de card_ids necessários
  reward_coins INTEGER DEFAULT 0,
  reward_gems INTEGER DEFAULT 0,
  reward_dust INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER ALBUMS (Progresso do usuário nos álbuns)
-- ============================================
CREATE TABLE user_albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  pasted_cards JSONB DEFAULT '[]', -- Array de card_ids colados
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, album_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_user_cards_user_id ON user_cards(user_id);
CREATE INDEX idx_user_cards_card_id ON user_cards(card_id);
CREATE INDEX idx_marketplace_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_seller ON marketplace_listings(seller_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users: everyone can read, only owner can update
CREATE POLICY "Users can read all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- User Cards: everyone can read for marketplace, only owner can manage
CREATE POLICY "User cards are viewable by everyone" ON user_cards FOR SELECT USING (true);
CREATE POLICY "Users can manage own cards" ON user_cards FOR ALL USING (auth.uid() = user_id);

-- Marketplace: everyone can see active listings
CREATE POLICY "Listings viewable by everyone" ON marketplace_listings FOR SELECT USING (status = 'active');
CREATE POLICY "Users can manage own listings" ON marketplace_listings FOR ALL USING (auth.uid() = seller_id);

-- Transactions: only owner can read/write
CREATE POLICY "Users can manage own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);

-- User Missions: only owner can manage
CREATE POLICY "Users can manage own missions" ON user_missions FOR ALL USING (auth.uid() = user_id);

-- User Albums: only owner can manage
CREATE POLICY "Users can manage own albums" ON user_albums FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Função para obter cards do usuário
CREATE OR REPLACE FUNCTION get_user_cards(user_uuid UUID)
RETURNS TABLE (
  card_id UUID,
  name TEXT,
  type TEXT,
  rarity TEXT,
  stars INTEGER,
  overall INTEGER,
  image_url TEXT,
  quantity INTEGER,
  is_pasted BOOLEAN,
  is_golden BOOLEAN,
  acquired_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.type,
    c.rarity,
    c.stars,
    c.overall,
    c.image_url,
    uc.quantity,
    uc.is_pasted,
    c.is_golden,
    uc.acquired_at
  FROM user_cards uc
  JOIN cards c ON uc.card_id = c.id
  WHERE uc.user_id = user_uuid AND uc.quantity > 0
  ORDER BY c.rarity DESC, c.overall DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para abrir pack e adicionar cards ao usuário
CREATE OR REPLACE FUNCTION open_pack(user_uuid UUID, pack_uuid UUID)
RETURNS TABLE(card_id UUID, card_name TEXT, rarity TEXT) AS $$
DECLARE
  pack_card_count INTEGER;
  pack_rarity TEXT;
  card_record RECORD;
  new_card_id UUID;
  result_table TABLE(card_id UUID, card_name TEXT, rarity TEXT);
BEGIN
  SELECT p.card_count, p.rarity INTO pack_card_count, pack_rarity FROM packs p WHERE p.id = pack_uuid;
  
  FOR i IN 1..pack_card_count LOOP
    -- Selecionar card aleatório baseado na probabilidade
    SELECT c.id, c.name, c.rarity INTO card_record
    FROM cards c
    WHERE c.rarity >= pack_rarity::TEXT
    ORDER BY RANDOM() * c.probability DESC
    LIMIT 1;
    
    -- Adicionar card ao usuário (ou incrementar quantidade)
    INSERT INTO user_cards (user_id, card_id, quantity, acquired_at)
    VALUES (user_uuid, card_record.id, 1, NOW())
    ON CONFLICT (user_id, card_id) 
    DO UPDATE SET quantity = user_cards.quantity + 1;
    
    result_table := result_table || ROW(card_record.id, card_record.name, card_record.rarity);
  END LOOP;
  
  RETURN QUERY SELECT * FROM result_table;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para destruir card e ganhar poeira
CREATE OR REPLACE FUNCTION destroy_card(user_uuid UUID, card_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  dust_reward INTEGER;
  card_qty INTEGER;
BEGIN
  -- Verificar se o usuário tem o card
  SELECT quantity INTO card_qty FROM user_cards WHERE user_id = user_uuid AND card_id = card_uuid;
  
  IF card_qty IS NULL OR card_qty <= 0 THEN
    RAISE EXCEPTION 'Card não encontrado ou quantidade insuficiente';
  END IF;
  
  -- Obter recompensa de poeira
  SELECT c.dust_reward INTO dust_reward FROM cards c WHERE c.id = card_uuid;
  
  -- Decrementar quantidade ou remover
  UPDATE user_cards 
  SET quantity = quantity - 1 
  WHERE user_id = user_uuid AND card_id = card_uuid;
  
  -- Adicionar poeira ao usuário
  UPDATE users SET dust = dust + dust_reward WHERE id = user_uuid;
  
  -- Registrar transação
  INSERT INTO transactions (user_id, type, amount, currency, description)
  VALUES (user_uuid, 'destroy', dust_reward, 'dust', 'Card destruído');
  
  RETURN dust_reward;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para criar usuário automaticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, username, email, avatar_url)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================
-- SEED DATA (Cards de exemplo)
-- ============================================
INSERT INTO cards (id, name, type, country, position, number, overall, stars, rarity, stats, is_golden, probability, dust_reward) VALUES
('11111111-1111-1111-1111-111111111111', 'Neymar Jr', 'player', 'Brasil', 'ATA', 10, 89, 3, 'epic', '{"attack": 91, "defense": 30, "speed": 88, "dribble": 94, "pass": 85, "physical": 65}', false, 0.03, 50),
('22222222-2222-2222-2222-222222222222', 'Messi', 'player', 'Argentina', 'ATA', 10, 93, 5, 'legendary', '{"attack": 93, "defense": 25, "speed": 80, "dribble": 96, "pass": 92, "physical": 68}', true, 0.005, 200),
('33333333-3333-3333-3333-333333333333', 'CR7', 'player', 'Portugal', 'ATA', 7, 91, 4, 'legendary', '{"attack": 93, "defense": 35, "speed": 87, "dribble": 88, "pass": 80, "physical": 80}', false, 0.01, 100),
('44444444-4444-4444-4444-444444444444', 'Mbappé', 'player', 'França', 'ATA', 10, 92, 4, 'legendary', '{"attack": 94, "defense": 30, "speed": 97, "dribble": 91, "pass": 78, "physical": 75}', false, 0.015, 80),
('55555555-5555-5555-5555-555555555555', 'Vini Jr', 'player', 'Brasil', 'ATA', 7, 90, 3, 'epic', '{"attack": 90, "defense": 28, "speed": 94, "dribble": 92, "pass": 80, "physical": 70}', false, 0.025, 60),
('66666666-6666-6666-6666-666666666666', '1000 Gols de Pelé', 'special', NULL, NULL, NULL, 99, 5, 'legendary', '{}', true, 0.001, 500),
('77777777-7777-7777-7777-777777777777', 'Cabeçada do Zidane', 'special', NULL, NULL, NULL, 95, 4, 'legendary', '{}', false, 0.002, 300),
('88888888-8888-8888-8888-888888888888', 'Gol de Letra', 'special', NULL, NULL, NULL, 88, 3, 'epic', '{}', false, 0.01, 80),
('99999999-9999-9999-9999-999999999999', 'Brazilian Master', 'special', NULL, NULL, NULL, 92, 4, 'legendary', '{}', false, 0.008, 150);

INSERT INTO packs (name, description, price_coins, price_gems, card_count, rarity) VALUES
('Pack Iniciante', 'Pack básico para começar sua coleção', 500, NULL, 3, 'common'),
('Pack Raro', 'Pack com mais chances de cards raros', 1500, NULL, 5, 'rare'),
('Pack Épico', 'Pack com cards épicos e lendários', 3500, NULL, 5, 'epic'),
('Pack Lendário', 'Pack premium com muitas chances lendárias', NULL, 750, 7, 'legendary');

INSERT INTO albums (name, description, required_cards, reward_coins, reward_gems, reward_dust) VALUES
('Copa do Mundo 2026', 'Complete a seleção do Brasil', '["11111111-1111-1111-1111-111111111111", "55555555-5555-5555-5555-555555555555"]', 1000, 100, 500),
('Lendários', 'Colecione os cards lendários', '["22222222-2222-2222-2222-222222222222", "33333333-3333-3333-3333-333333333333", "44444444-4444-4444-4444-444444444444"]', 2000, 200, 1000);