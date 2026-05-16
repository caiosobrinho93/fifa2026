'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface InventoryContextType {
  userCards: Record<string, number>; // cardId -> quantity
  addCards: (cardIds: string[]) => void;
  isLoading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [userCards, setUserCards] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('fifa2026_inventory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setUserCards(parsed);
          setIsLoading(false);
        }, 0);
        return;
      } catch (e) {
        console.error("Failed to parse inventory", e);
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  }, []);

  // Save to localStorage whenever userCards change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('fifa2026_inventory', JSON.stringify(userCards));
    }
  }, [userCards, isLoading]);

  const addCards = (cardIds: string[]) => {
    setUserCards(prev => {
      const next = { ...prev };
      cardIds.forEach(id => {
        next[id] = (next[id] || 0) + 1;
      });
      return next;
    });
    
    toast.success(`${cardIds.length} cards sincronizados com sucesso!`);
  };

  return (
    <InventoryContext.Provider value={{ userCards, addCards, isLoading }}>
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
