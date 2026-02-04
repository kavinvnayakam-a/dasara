"use client"

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionTimer } from '@/hooks/use-session-timer';
import { useCart } from '@/hooks/use-cart';
import { useFirestore } from '@/firebase'; 
import { collection, onSnapshot, query } from 'firebase/firestore'; 
import { Header } from '@/components/header';
import { MenuItemCard } from '@/components/menu-item-card';
import { CartSheet } from '@/components/cart-sheet';
import { CartIcon } from '@/components/cart-icon';
import type { MenuItem } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock as ClockIcon, ArrowRight } from 'lucide-react';

export default function CustomerView({ tableId }: { tableId: string | null, mode: 'dine-in' | 'takeaway' }) {
  const router = useRouter();
  const { clearCart, addToCart } = useCart();
  const [isCartOpen, setCartOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(!!tableId);
  const { toast } = useToast();
  const firestore = useFirestore();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;
    const q = query(collection(firestore, "menu_items")); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[];
      setMenuItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    return () => unsubscribe(); 
  }, [firestore]);

  const { timeLeft } = useSessionTimer(() => {
    clearCart();
    router.push('/thanks');
  });

  useEffect(() => {
    if (tableId && typeof window !== 'undefined' && window.innerWidth < 768) {
      toast({
        title: "Session Active",
        description: "Order within 10mins to keep your table session.",
        className: "bg-foreground text-background border-b-4 border-accent",
        duration: 5000,
      });
    }
  }, [tableId, toast]);

  const categorizedMenu = useMemo(() => {
    const categoryOrder = [
      'Coffee', 'Pastries', 'Cakes', 'Sandwiches', 
      'Beverages', 'Swiss Specials', 'Sides'
    ];
    
    const grouped = menuItems.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    const orderedGroups = categoryOrder.map(category => ({
      category,
      items: grouped[category] || []
    })).filter(group => group.items.length > 0);

    const extraGroups = Object.keys(grouped)
      .filter(cat => !categoryOrder.includes(cat))
      .map(cat => ({
        category: cat,
        items: grouped[cat]
      }));

    return [...orderedGroups, ...extraGroups];
  }, [menuItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="font-black uppercase italic text-foreground tracking-tighter">Brewing the Menu...</h2>
        </div>
      </div>
    );
  }

  if (!showMenu && !tableId) {
    return (
      <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-2">
             <div className="bg-white rounded-full p-2 inline-block mx-auto shadow-lg">
              <Image src="https://firebasestorage.googleapis.com/v0/b/swissdelights-2a272.firebasestorage.app/o/Swiss_logo.webp?alt=media&token=70912942-ad4e-4840-9c22-99ab267c42c6" alt="Swiss Delight Logo" width={200} height={50} />
            </div>
            <div className="h-2 w-24 bg-foreground mx-auto rounded-full" />
            <p className="font-bold text-foreground uppercase tracking-[0.3em] text-xs pt-2">
              Exquisite pastries & coffee.
            </p>
          </div>

          <div className="bg-card border-4 border-foreground p-8 rounded-[3rem] shadow-[12px_12px_0_0_hsl(var(--foreground))] space-y-6 text-left transform -rotate-1">
            <p className="text-foreground font-bold italic text-lg leading-tight">
              "Experience a taste of Switzerland, baked fresh daily."
            </p>
            
            <div className="space-y-4 pt-4 border-t-2 border-border">
              <div className="flex items-center gap-4">
                <div className="bg-foreground p-2 rounded-xl text-accent"><MapPin size={18}/></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Find Us</p>
                  <p className="font-black text-sm uppercase text-foreground">Hyderabad-Vanasthalipuram, HYD</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-foreground p-2 rounded-xl text-accent"><ClockIcon size={18}/></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Hours</p>
                  <p className="font-black text-sm uppercase text-foreground">08:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowMenu(true)}
            className="group w-full bg-foreground text-background py-6 rounded-[2rem] font-black uppercase italic text-2xl shadow-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Order Take-Away
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          <p className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest opacity-60">
            Scan Table QR for Dine-In Experience
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <Header tableId={tableId || "Takeaway"} onCartClick={() => setCartOpen(true)} timeLeft={timeLeft} />
      
      <main className="container mx-auto px-4 py-8 pb-32">
        <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter text-foreground leading-none">
              Menu
            </h1>
            <p className="text-muted-foreground font-bold mt-2 uppercase tracking-widest text-xs">
              {tableId ? `Table ${tableId} • Live Selection` : 'Take-Away • Instant Pickup'}
            </p>
          </div>
          {!tableId && (
            <div className="bg-foreground text-background px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Take-Away Mode
            </div>
          )}
        </header>

        <Accordion type="multiple" defaultValue={['Coffee', 'Pastries']} className="w-full space-y-4">
          {categorizedMenu.map(({ category, items }) => (
            <AccordionItem value={category} key={category} className="border-none">
              <AccordionTrigger className="flex px-6 py-4 bg-foreground text-background rounded-xl shadow-[4px_4px_0_0_#00000040] hover:no-underline transition-transform active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black uppercase italic tracking-tight">{category}</span>
                  <span className="text-[10px] bg-background text-foreground px-2 py-0.5 rounded font-bold">{items.length}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-6 px-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="bg-card rounded-3xl p-2 shadow-xl border-2 border-border/5">
                      <MenuItemCard item={item} onAddToCart={addToCart} />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>

      <footer className="mt-20 bg-secondary/50 text-foreground py-12 px-6 border-t-4 border-foreground">
        <div className="container mx-auto flex flex-col items-center gap-6">
          <div className="bg-white rounded-full p-2 inline-block">
            <Image src="https://firebasestorage.googleapis.com/v0/b/swissdelights-2a272.firebasestorage.app/o/Swiss_logo.webp?alt=media&token=70912942-ad4e-4840-9c22-99ab267c42c6" alt="Swiss Delight Logo" width={180} height={45} />
          </div>
          <div className="h-px w-16 bg-foreground" />
          <Link href="https://www.getpik.in/" target="_blank" className="group flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/80">Designed By</span>
            <div className="flex items-center gap-2 bg-card px-5 py-2 rounded-2xl border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              <span className="text-foreground font-black text-xl tracking-tight">GetPik</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </Link>
          <p className="text-[9px] text-muted-foreground/80 font-medium uppercase tracking-widest mt-4">© 2026 All Rights Reserved</p>
        </div>
      </footer>

      <CartSheet isOpen={isCartOpen} onOpenChange={setCartOpen} tableId={tableId} />
      <CartIcon onOpen={() => setCartOpen(true)} />
    </div>
  );
}
