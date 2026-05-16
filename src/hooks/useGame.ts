'use client';

import { useState } from 'react';
import { UserCard, Card } from '@/types/game';
import { MOCK_USER_CARDS, MOCK_CARDS, MOCK_USER, drawRandomCards } from '@/lib/mock-data';
import { toast } from 'sonner';

export function useGame() {
  const [coins, setCoins] = useState(MOCK_USER.coins);
  const [gems, setGems] = useState(MOCK_USER.gems);
  const [dust, setDust] = useState(MOCK_USER.dust);
  const [userCards, setUserCards] = useState<UserCard[]>(MOCK_USER_CARDS);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar card do usuário por card_id
  const getUserCard = (cardId: string) => {
    return userCards.find(c => c.card_id === cardId);
  };

  // Adicionar card ao usuário (ou incrementar quantidade)
  const addCard = (cardId: string) => {
    setUserCards(prev => {
      const existing = prev.find(c => c.card_id === cardId);
      if (existing) {
        return prev.map(c => c.card_id === cardId ? { ...c, quantity: (c.quantity || 0) + 1 } : c);
      }
      return [...prev, { 
        id: `uc-${Date.now()}`,
        user_id: MOCK_USER.id, 
        card_id: cardId, 
        quantity: 1, 
        is_pasted: false, 
        acquired_at: new Date().toISOString()
      }];
    });
  };

  // Comprar card específico
  const buyCard = (cardId: string, price: number) => {
    if (coins < price) {
      toast.error("Moedas insuficientes!");
      return false;
    }

    setCoins(prev => prev - price);
    addCard(cardId);

    toast.success("Card adquirido com sucesso!");
    return true;
  };

  // Abrir pack e sortear cards
  const openPack = (cardCount: number, price: number, currency: 'coins' | 'gems' = 'coins', minRarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common') => {
    const currentBalance = currency === 'coins' ? coins : gems;
    
    if (currentBalance < price) {
      toast.error(currency === 'coins' ? "Moedas insuficientes!" : "Gemas insuficientes!");
      return null;
    }

    if (currency === 'coins') {
      setCoins(prev => prev - price);
    } else {
      setGems(prev => prev - price);
    }
    
    const newCards = drawRandomCards(cardCount, minRarity);

    newCards.forEach(card => {
      addCard(card.id);
    });

    return newCards;
  };

  // Colar card no álbum
  const pasteCard = (cardId: string) => {
    const card = getUserCard(cardId);
    if (!card || (card.quantity || 0) <= 0) return false;

    setUserCards(prev => prev.map(c => c.card_id === cardId ? { ...c, is_pasted: true, quantity: (c.quantity || 1) - 1 } : c));
    return true;
  };

  // Destruir card e ganhar poeira
  const destroyCard = (cardId: string) => {
    const card = getUserCard(cardId);
    if (!card || (card.quantity || 0) <= 0) {
      toast.error("Card não encontrado!");
      return 0;
    }

    const cardData = MOCK_CARDS.find(c => c.id === cardId);
    const dustReward = cardData?.dust_reward || 10;

    setUserCards(prev => prev.map(c => c.card_id === cardId ? { ...c, quantity: (c.quantity || 1) - 1 } : c));
    setDust(prev => prev + dustReward);

    toast.success(`+${dustReward} poeira estelar`);
    return dustReward;
  };

  // Obter todos os cards do usuário com dados completos
  const getUserCardsWithDetails = () => {
    return userCards.map(uc => ({
      ...uc,
      card: MOCK_CARDS.find(c => c.id === uc.card_id)!
    })).filter(uc => uc.card);
  };

  return {
    coins,
    gems,
    dust,
    userCards,
    isLoading,
    getUserCard,
    addCard,
    buyCard,
    openPack,
    pasteCard,
    destroyCard,
    getUserCardsWithDetails
  };
}