import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface StashProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  productType: string;
}

interface StashContextType {
  showStashDot: boolean;
  isBlinking: boolean;
  showStashPrompt: boolean;
  stashedProducts: StashProduct[];
  triggerStash: () => void;
  clearStashDot: () => void;
  closePrompt: () => void;
  addToStash: (product: StashProduct) => void;
  removeFromStash: (productId: string) => void;
  isInStash: (productId: string) => boolean;
}

const StashContext = createContext<StashContextType | undefined>(undefined);

export const StashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showStashDot, setShowStashDot] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showStashPrompt, setShowStashPrompt] = useState(false);
  const [stashedProducts, setStashedProducts] = useState<StashProduct[]>([]);

  // Load stashed products from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stashedProducts');
      if (saved) {
        try {
          setStashedProducts(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading stashed products:', error);
        }
      }
    }
  }, []);

  // Save to localStorage whenever stashedProducts changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stashedProducts', JSON.stringify(stashedProducts));
    }
  }, [stashedProducts]);

  const triggerStash = useCallback(() => {
    setShowStashDot(true);
    setIsBlinking(true);
    setShowStashPrompt(true);
    setTimeout(() => setIsBlinking(false), 3500);
  }, []);

  const clearStashDot = useCallback(() => {
    setShowStashDot(false);
    setIsBlinking(false);
  }, []);

  const closePrompt = useCallback(() => {
    setShowStashPrompt(false);
  }, []);

  const addToStash = useCallback((product: StashProduct) => {
    setStashedProducts(prev => {
      // Check if product already exists
      const exists = prev.some(p => p.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
    triggerStash(); // Show the stash feedback
  }, [triggerStash]);

  const removeFromStash = useCallback((productId: string) => {
    setStashedProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const isInStash = useCallback((productId: string) => {
    return stashedProducts.some(p => p.id === productId);
  }, [stashedProducts]);

  return (
    <StashContext.Provider value={{ 
      showStashDot, 
      isBlinking, 
      showStashPrompt, 
      stashedProducts,
      triggerStash, 
      clearStashDot, 
      closePrompt,
      addToStash,
      removeFromStash,
      isInStash
    }}>
      {children}
    </StashContext.Provider>
  );
};

export function useStash() {
  const ctx = useContext(StashContext);
  if (!ctx) throw new Error('useStash must be used within a StashProvider');
  return ctx;
} 