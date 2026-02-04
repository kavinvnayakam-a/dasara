"use client"

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";

export function CartIcon({ onOpen }: { onOpen?: () => void }) {
  const { totalItems } = useCart();
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    if (totalItems === 0) return;
    setIsAnimate(true);
    const timer = setTimeout(() => setIsAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [totalItems]);

  return (
    <button 
      onClick={onOpen}
      aria-label="Open cart"
      className={`
        fixed right-0 top-1/2 -translate-y-1/2 z-50
        flex flex-col items-center gap-2
        bg-stone-800 text-white
        py-5 px-3
        rounded-l-[2rem]
        border-y-2 border-l-2 border-amber-500
        
        shadow-[-10px_0px_30px_rgba(0,0,0,0.2)]
        transition-all duration-300 active:scale-90
        ${isAnimate ? 'translate-x-0 scale-110' : 'translate-x-0 scale-100'}
        hover:bg-stone-700
      `}
    >
      <div className="
        flex h-6 w-6 items-center justify-center 
        rounded-full bg-amber-500 text-stone-800 
        text-[10px] font-black border-2 border-white
        shadow-sm
      ">
        {totalItems}
      </div>

      <ShoppingBag className="h-6 w-6 text-amber-500" />

      <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
        Your Cart
      </span>

      {totalItems > 0 && (
        <div className="mt-2 pt-2 border-t border-stone-700 w-full flex justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      )}
    </button>
  );
}
