"use client"

import { useState } from 'react';
import { useSessionTimer } from '@/hooks/use-session-timer';
import { useCart } from '@/hooks/use-cart';
import { menuItems } from '@/lib/menu-data';
import { Header } from '@/components/header';
import { MenuItemCard } from '@/components/menu-item-card';
import { CartSheet } from '@/components/cart-sheet';
import { Button } from '@/components/ui/button';

export default function CustomerView({ tableId }: { tableId: string | null }) {
  const { clearCart, addToCart } = useCart();
  const [isCartOpen, setCartOpen] = useState(false);

  useSessionTimer(() => {
    clearCart();
  });

  if (!tableId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-4xl font-extrabold text-foreground">Welcome to Grillicious!</h1>
        <p className="mt-4 text-lg text-foreground">Please scan the QR code on your table to start your order.</p>
        <div className="mt-8 p-6 bg-card border-4 border-foreground shadow-[8px_8px_0px_#000] rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-foreground"><path d="M5 5h3v3H5z"/><path d="M5 16h3v3H5z"/><path d="M16 5h3v3h-3z"/><path d="M16 16h3v3h-3z"/><path d="M9 5v14"/><path d="M5 9h14"/></svg>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header tableId={tableId} />
      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
          ))}
        </div>
      </main>
      <CartSheet isOpen={isCartOpen} onOpenChange={setCartOpen} tableId={tableId} />
      {/* Floating Cart Button for mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
          <CartIcon onOpen={() => setCartOpen(true)} />
      </div>
    </>
  );
}
