'use client';

import { useState, useEffect } from 'react';
import { Player, UserCard } from '@/types/game';
import { MOCK_USER_CARDS, MOCK_PLAYERS } from '@/lib/mock-data';
import { toast } from 'sonner';

// This hook simulates a Supabase backend but can be easily switched to real DB calls
export function useGame() {
  const [coins, setCoins] = useState(12500);
  const [userCards, setUserCards] = useState<UserCard[]>(MOCK_USER_CARDS);
  const [isLoading, setIsLoading] = useState(false);

  // Buy a specific card
  const buyCard = (playerId: string, price: number) => {
    if (coins < price) {
      toast.error("Moedas insuficientes!");
      return false;
    }

    setCoins(prev => prev - price);
    
    setUserCards(prev => {
      const existing = prev.find(c => c.player_id === playerId);
      if (existing) {
        return prev.map(c => c.player_id === playerId ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { 
        id: Math.random().toString(), 
        user_id: 'user1', 
        player_id: playerId, 
        quantity: 1, 
        is_pasted: false, 
        is_shiny: false 
      }];
    });

    toast.success("Card adquirido com sucesso!");
    return true;
  };

  // Open a pack and get random cards
  const openPack = (cardCount: number, price: number) => {
    if (coins < price) {
      toast.error("Moedas insuficientes!");
      return null;
    }

    setCoins(prev => prev - price);
    
    const newCards = Array.from({ length: cardCount }).map(() => {
      return MOCK_PLAYERS[Math.floor(Math.random() * MOCK_PLAYERS.length)];
    });

    // Update state
    newCards.forEach(player => {
       setUserCards(prev => {
          const existing = prev.find(c => c.player_id === player.id);
          if (existing) {
            return prev.map(c => c.player_id === player.id ? { ...c, quantity: c.quantity + 1 } : c);
          }
          return [...prev, { 
            id: Math.random().toString(), 
            user_id: 'user1', 
            player_id: player.id, 
            quantity: 1, 
            is_pasted: false, 
            is_shiny: false 
          }];
       });
    });

    return newCards;
  };

  // Paste a card in the album
  const pasteCard = (playerId: string) => {
    const card = userCards.find(c => c.player_id === playerId);
    if (!card || card.quantity <= 0) return false;

    setUserCards(prev => prev.map(c => c.player_id === playerId ? { ...c, is_pasted: true, quantity: c.quantity - 1 } : c));
    return true;
  };

  return {
    coins,
    userCards,
    isLoading,
    buyCard,
    openPack,
    pasteCard
  };
}
