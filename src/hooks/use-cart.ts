"use client";
import { useCartContext } from '@/context/cart-context';

export const useCart = () => {
  return useCartContext();
};