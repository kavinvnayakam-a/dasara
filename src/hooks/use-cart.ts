"use client";

import { useLocalStorage } from '@/hooks/use-local-storage';
import type { CartItem, MenuItem } from '@/lib/types';
import { useMemo } from 'react';

export const useCart = () => {
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
      if (quantity <= 0) {
        return prevItems.filter((i) => i.id !== itemId);
      }
      return prevItems.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      );
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    totalItems,
  };
};
