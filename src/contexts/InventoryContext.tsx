'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface InventoryContextType {
  userCards: Record<string, number>; // cardId -> quantity
  pastedCards: Record<string, boolean>; // cardId -> true if pasted
  addCards: (cardIds: string[]) => void;
  removeCard: (cardId: string) => void;
  pasteCard: (cardId: string) => void;
  isLoading: boolean;
  totalCards: number;
  uniqueCards: number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userCards, setUserCards] = useState<Record<string, number>>({});
  const [pastedCards, setPastedCards] = useState<Record<string, boolean>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Dynamic keys for fallback demo mode
  const inventoryKey = user ? `fifa2026_inventory_${user.id}` : 'fifa2026_inventory_guest';
  const pastedKey = user ? `fifa2026_pasted_${user.id}` : 'fifa2026_pasted_guest';

  // Fetch from Supabase on mount or user change
  useEffect(() => {
    let isMounted = true;
    setIsHydrated(false);

    const loadInventory = async () => {
      // 1. Try to fetch from Supabase if it's a real user (not demo)
      if (user && !user.id.startsWith('demo-')) {
        try {
          const { data, error } = await supabase
            .from('user_cards')
            .select('card_id, quantity, is_pasted')
            .eq('user_id', user.id);

          if (!error && data) {
            const newCards: Record<string, number> = {};
            const newPasted: Record<string, boolean> = {};
            data.forEach((row: any) => {
              if (row.quantity > 0) newCards[row.card_id] = row.quantity;
              if (row.is_pasted) newPasted[row.card_id] = true;
            });
            if (isMounted) {
              setUserCards(newCards);
              setPastedCards(newPasted);
              setIsHydrated(true);
            }
            return; // Successfully loaded from DB, exit
          }
        } catch (e) {
          console.error('Supabase fetch error:', e);
        }
      }

      // 2. Fallback to LocalStorage if demo user or Supabase fails
      try {
        const savedCards = localStorage.getItem(inventoryKey);
        const savedPasted = localStorage.getItem(pastedKey);
        if (isMounted) {
          setUserCards(savedCards ? JSON.parse(savedCards) : {});
          setPastedCards(savedPasted ? JSON.parse(savedPasted) : {});
        }
      } catch (e) {
        if (isMounted) {
          setUserCards({});
          setPastedCards({});
        }
      } finally {
        if (isMounted) setIsHydrated(true);
      }
    };

    loadInventory();

    return () => {
      isMounted = false;
    };
  }, [user, inventoryKey, pastedKey]);

  // Sync to Supabase whenever a card operation occurs
  const syncToDatabase = useCallback(async (
    playerId: string, 
    newQuantity: number, 
    isPasted: boolean
  ) => {
    if (!user || user.id.startsWith('demo-')) return;
    
    try {
      await supabase.from('user_cards').upsert({
        user_id: user.id,
        card_id: playerId,
        quantity: newQuantity,
        is_pasted: isPasted,
        is_shiny: false // Defaulting for now
      }, { onConflict: 'user_id, card_id' });
    } catch (e) {
      console.error('Failed to sync card to Supabase:', e);
    }
  }, [user]);

  // Sync to local storage for demo users
  useEffect(() => {
    if (isHydrated && (!user || user.id.startsWith('demo-'))) {
      localStorage.setItem(inventoryKey, JSON.stringify(userCards));
      localStorage.setItem(pastedKey, JSON.stringify(pastedCards));
    }
  }, [userCards, pastedCards, isHydrated, inventoryKey, pastedKey, user]);

  const addCards = (cardIds: string[]) => {
    // Local optimistic update
    setUserCards(prev => {
      const next = { ...prev };
      
      // Calculate counts for DB Sync
      const counts: Record<string, number> = {};
      cardIds.forEach(id => {
        next[id] = (next[id] || 0) + 1;
        counts[id] = next[id];
      });

      // Fire async sync for each card
      Object.keys(counts).forEach(id => {
        syncToDatabase(id, counts[id], pastedCards[id] || false);
      });

      return next;
    });
    
    toast.success(`${cardIds.length} card${cardIds.length > 1 ? 's' : ''} adicionado${cardIds.length > 1 ? 's' : ''} ao inventário!`);
  };

  const removeCard = (cardId: string) => {
    setUserCards(prev => {
      const next = { ...prev };
      if (next[cardId] > 1) {
        next[cardId] -= 1;
        syncToDatabase(cardId, next[cardId], pastedCards[cardId] || false);
      } else {
        delete next[cardId];
        syncToDatabase(cardId, 0, pastedCards[cardId] || false);
      }
      return next;
    });
  };

  const pasteCard = (cardId: string) => {
    if (pastedCards[cardId] || !userCards[cardId] || userCards[cardId] < 1) return;
    
    setPastedCards(prev => ({ ...prev, [cardId]: true }));
    removeCard(cardId);
    
    // removeCard already syncs the quantity, but we also need to sync the is_pasted=true
    // The previous removeCard sync might run before or after, so let's fire one explicit sync
    const newQuantity = userCards[cardId] - 1;
    syncToDatabase(cardId, newQuantity, true);
  };

  const totalCards = Object.values(userCards).reduce((sum, q) => sum + q, 0);
  const uniqueCards = Object.keys(userCards).length;

  return (
    <InventoryContext.Provider value={{ 
      userCards, 
      pastedCards,
      addCards, 
      removeCard,
      pasteCard,
      isLoading: !isHydrated,
      totalCards,
      uniqueCards,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

