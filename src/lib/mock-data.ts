import { Card, User, UserCard, Pack, Album, Rarity } from '@/types/game';

// ============================================
// CARDS (Master Data - todos os cards existentes)
// ============================================
export const MOCK_CARDS: Card[] = [
  // NEYMAR VARIANTS (Unique IDs per combination)
  {
    id: 'ney-rar-1',
    name: 'Neymar Jr',
    type: 'player',
    country: 'Brasil',
    position: 'ATA',
    overall: 85,
    stars: 1,
    rarity: 'rare',
    stats: { attack: 84, defense: 25, speed: 88, dribble: 92, pass: 80, physical: 60 },
    image_url: 'https://www.fifarosters.com/assets/players/fifa24/faces/190871.png',
    is_golden: false,
    probability: 0.10,
    dust_reward: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: 'ney-epi-3',
    name: 'Neymar Jr',
    type: 'player',
    country: 'Brasil',
    position: 'ATA',
    overall: 89,
    stars: 3,
    rarity: 'epic',
    stats: { attack: 88, defense: 30, speed: 90, dribble: 95, pass: 85, physical: 62 },
    image_url: 'https://www.fifarosters.com/assets/players/fifa24/faces/190871.png',
    is_golden: false,
    probability: 0.03,
    dust_reward: 100,
    created_at: new Date().toISOString(),
  },
  {
    id: 'ney-len-5',
    name: 'Neymar Jr',
    type: 'player',
    country: 'Brasil',
    position: 'ATA',
    overall: 94,
    stars: 5,
    rarity: 'legendary',
    stats: { attack: 94, defense: 35, speed: 95, dribble: 99, pass: 90, physical: 65 },
    image_url: 'https://www.fifarosters.com/assets/players/fifa24/faces/190871.png',
    is_golden: true,
    probability: 0.005,
    dust_reward: 500,
    created_at: new Date().toISOString(),
  },

  // MESSI VARIANTS
  {
    id: 'mes-epi-3',
    name: 'Lionel Messi',
    type: 'player',
    country: 'Argentina',
    position: 'ATA',
    overall: 90,
    stars: 3,
    rarity: 'epic',
    stats: { attack: 90, defense: 25, speed: 80, dribble: 94, pass: 92, physical: 60 },
    image_url: 'https://www.fifarosters.com/assets/players/fifa24/faces/158023.png',
    is_golden: false,
    probability: 0.02,
    dust_reward: 120,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mes-len-5',
    name: 'Lionel Messi',
    type: 'player',
    country: 'Argentina',
    position: 'ATA',
    overall: 93,
    stars: 5,
    rarity: 'legendary',
    stats: { attack: 93, defense: 25, speed: 85, dribble: 96, pass: 94, physical: 65 },
    image_url: 'https://www.fifarosters.com/assets/players/fifa24/faces/158023.png',
    is_golden: true,
    probability: 0.005,
    dust_reward: 500,
    created_at: new Date().toISOString(),
  },

  // SPECIALS
  {
    id: 'spc-pele-1000',
    name: '1000 Gols de Pelé',
    type: 'special',
    description: 'O Rei do Futebol atinge o milésimo gol.',
    overall: 99,
    stars: 5,
    rarity: 'legendary',
    stats: { attack: 99, defense: 50, speed: 99, dribble: 99, pass: 99, physical: 99 },
    image_url: 'https://static.goal.com/131500/131532_hero_a.jpg',
    is_golden: true,
    probability: 0.0001,
    dust_reward: 1000,
    created_at: new Date().toISOString(),
  },
  {
    id: 'spc-zidane-head',
    name: 'Cabeçada do Zidane',
    type: 'special',
    description: 'Momento icônico da final da Copa 2006.',
    overall: 95,
    stars: 4,
    rarity: 'legendary',
    stats: { attack: 95, defense: 40, speed: 80, dribble: 90, pass: 90, physical: 95 },
    image_url: 'https://images.ps-cdn.com/global-img/no-img.png',
    is_golden: false,
    probability: 0.001,
    dust_reward: 400,
    created_at: new Date().toISOString(),
  },
  {
    id: 'spc-forca-bruta',
    name: 'Força Bruta',
    type: 'special',
    description: 'A potência física máxima em um card.',
    overall: 92,
    stars: 4,
    rarity: 'epic',
    stats: { attack: 85, defense: 85, speed: 80, dribble: 70, pass: 70, physical: 99 },
    image_url: 'https://images.ps-cdn.com/global-img/no-img.png',
    is_golden: false,
    probability: 0.01,
    dust_reward: 200,
    created_at: new Date().toISOString(),
  },

  // VINI JR VARIANTS
  {
    id: 'vin-rar-2',
    name: 'Vini Jr.',
    type: 'player',
    country: 'Brasil',
    position: 'ATA',
    overall: 86,
    stars: 2,
    rarity: 'rare',
    stats: { attack: 85, defense: 25, speed: 94, dribble: 90, pass: 75, physical: 70 },
    image_url: 'https://www.fifarosters.com/assets/players/fifa24/faces/238794.png',
    is_golden: false,
    probability: 0.05,
    dust_reward: 40,
    created_at: new Date().toISOString(),
  },
  {
    id: 'vin-len-5',
    name: 'Vini Jr.',
    type: 'player',
    country: 'Brasil',
    position: 'ATA',
    overall: 92,
    stars: 5,
    rarity: 'legendary',
    stats: { attack: 92, defense: 30, speed: 98, dribble: 96, pass: 85, physical: 78 },
    image_url: 'https://www.fifarosters.com/assets/players/fifa24/faces/238794.png',
    is_golden: true,
    probability: 0.008,
    dust_reward: 450,
    created_at: new Date().toISOString(),
  },
];

// ============================================
// USER (Dados do usuário logado)
// ============================================
export const MOCK_USER: User = {
  id: 'user-001',
  username: 'Caio',
  email: 'caio@example.com',
  avatar_url: '',
  level: 15,
  xp: 1200,
  coins: 12500,
  gems: 450,
  dust: 150,
  is_vip: true,
  is_admin: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// ============================================
// USER CARDS (Cards que o usuário possui)
// ============================================
export const MOCK_USER_CARDS: UserCard[] = [
  { id: 'uc-001', user_id: 'user-001', card_id: 'vin-rar-2', quantity: 1, is_pasted: false, acquired_at: new Date().toISOString() },
  { id: 'uc-002', user_id: 'user-001', card_id: 'mes-len-5', quantity: 1, is_pasted: true, acquired_at: new Date().toISOString() },
  { id: 'uc-003', user_id: 'user-001', card_id: 'ney-rar-1', quantity: 2, is_pasted: false, acquired_at: new Date().toISOString() },
  { id: 'uc-004', user_id: 'user-001', card_id: 'ney-epi-3', quantity: 1, is_pasted: false, acquired_at: new Date().toISOString() },
  { id: 'uc-005', user_id: 'user-001', card_id: 'vin-len-5', quantity: 1, is_pasted: true, acquired_at: new Date().toISOString() },
  { id: 'uc-006', user_id: 'user-001', card_id: 'spc-pele-1000', quantity: 1, is_pasted: true, acquired_at: new Date().toISOString() },
  { id: 'uc-007', user_id: 'user-001', card_id: 'mes-epi-3', quantity: 1, is_pasted: false, acquired_at: new Date().toISOString() },
  { id: 'uc-008', user_id: 'user-001', card_id: 'spc-zidane-head', quantity: 1, is_pasted: false, acquired_at: new Date().toISOString() },
];

// ============================================
// PACKS
// ============================================
export const MOCK_PACKS: Pack[] = [
  { id: 'pack-001', name: 'Pack Iniciante', description: 'Pack básico para começar', price_coins: 500, card_count: 3, rarity: 'common' },
  { id: 'pack-002', name: 'Pack Raro', description: 'Mais chances de raros', price_coins: 1500, card_count: 5, rarity: 'rare' },
  { id: 'pack-003', name: 'Pack Épico', description: 'Cards épicos e lendários', price_coins: 3500, card_count: 5, rarity: 'epic' },
  { id: 'pack-004', name: 'Pack Lendário', description: 'Alta chance lendária', price_gems: 750, card_count: 7, rarity: 'legendary' },
];

// ============================================
// ALBUMS
// ============================================
export const MOCK_ALBUMS: Album[] = [
  { 
    id: 'alb-bra-2026', 
    name: 'Brasil 2026', 
    description: 'A nova geração em busca do Hexa.',
    required_cards: ['ney-len-5', 'vin-len-5', 'vin-rar-2'],
    reward_coins: 5000,
    reward_gems: 500,
    reward_dust: 1000,
    bg_color: 'from-yellow-600/20 via-green-900/40 to-black',
    theme_image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000'
  },
  { 
    id: 'alb-98-retro', 
    name: 'Copa 98: Retro', 
    description: 'Reviva a magia da Copa na França.',
    required_cards: ['spc-zidane-head'],
    reward_coins: 10000,
    reward_gems: 1000,
    reward_dust: 2000,
    bg_color: 'from-blue-900/40 via-blue-700/20 to-black',
    theme_image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000'
  },
  { 
    id: 'alb-fem-2026', 
    name: 'Seleção Feminina', 
    description: 'As craques que dominam o gramado.',
    required_cards: [], // A ser preenchido
    reward_coins: 3000,
    reward_gems: 300,
    reward_dust: 500,
    bg_color: 'from-pink-900/30 via-purple-900/20 to-black',
    theme_image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=1000'
  },
  { 
    id: 'alb-legends', 
    name: 'Lendas Imortais', 
    description: 'O panteão dos maiores da história.',
    required_cards: ['spc-pele-1000', 'mes-len-5'],
    reward_coins: 50000,
    reward_gems: 5000,
    reward_dust: 10000,
    bg_color: 'from-orange-900/40 via-yellow-900/20 to-black',
    theme_image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=1000'
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Buscar card por ID
export function getCardById(cardId: string): Card | undefined {
  return MOCK_CARDS.find(c => c.id === cardId);
}

// Buscar todos os cards do usuário (com dados completos)
export function getUserCardsWithDetails(): (UserCard & { card: Card })[] {
  return MOCK_USER_CARDS.map(uc => ({
    ...uc,
    card: getCardById(uc.card_id)!
  })).filter(uc => uc.card);
}

// Buscar cards por raridade
export function getCardsByRarity(rarity: Rarity): Card[] {
  return MOCK_CARDS.filter(c => c.rarity === rarity);
}

// Sortear cards aleatórios com base na probabilidade
export function drawRandomCards(count: number, minRarity: Rarity = 'common'): Card[] {
  const rarityOrder: Rarity[] = ['common', 'rare', 'epic', 'legendary'];
  const minIndex = rarityOrder.indexOf(minRarity);
  
  const eligibleCards = MOCK_CARDS.filter(c => rarityOrder.indexOf(c.rarity) >= minIndex);
  
  const result: Card[] = [];
  for (let i = 0; i < count; i++) {
    // Normalizar probabilidades
    const totalProb = eligibleCards.reduce((sum, c) => sum + c.probability, 0);
    const random = Math.random() * totalProb;
    
    let cumulative = 0;
    for (const card of eligibleCards) {
      cumulative += card.probability;
      if (random <= cumulative) {
        result.push(card);
        break;
      }
    }
  }
  
  return result;
}

// Manter compatibilidade com código antigo
export const MOCK_PLAYERS = MOCK_CARDS;