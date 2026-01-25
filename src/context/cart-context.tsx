"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { CartItem, MenuItem } from '@/lib/types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  cartTotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // This is the SINGLE source of truth for the entire app
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cart', []);

  const addToCart = (item: MenuItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) return prevItems.filter((i) => i.id !== itemId);
      return prevItems.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = useMemo(() => 
    cartItems.reduce((t, i) => t + i.price * i.quantity, 0), [cartItems]
  );
  
  const totalItems = useMemo(() => 
    cartItems.reduce((t, i) => t + i.quantity, 0), [cartItems]
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};