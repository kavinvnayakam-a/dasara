"use client"

import Image from "next/image";
import type { MenuItem } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

type MenuItemCardProps = {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
};

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const isSoldOut = !item.available;

  return (
    <div className={cn(
      "group bg-white rounded-[2.5rem] border-2 border-stone-800/5 overflow-hidden transition-all shadow-md",
      isSoldOut ? "opacity-70" : "active:scale-[0.98] hover:shadow-2xl"
    )}>
      
      <div className="relative h-60 w-full overflow-hidden bg-stone-100">
        {isSoldOut && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
            <span className="bg-stone-800 text-white font-black uppercase italic px-4 py-2 rounded-xl border-2 border-white/50 text-sm shadow-lg">
              Sold Out
            </span>
          </div>
        )}
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              !isSoldOut && "group-hover:scale-110"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-16 w-16 text-stone-300" />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-stone-800 leading-tight">
            {item.name}
          </h3>
          <p className="text-stone-500 text-sm font-medium line-clamp-2 mt-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-baseline justify-between">
             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Price</span>
             <span className={cn(
               "text-4xl font-black tracking-tighter tabular-nums",
                isSoldOut ? "text-stone-400" : "text-emerald-600"
              )}>
                {formatCurrency(item.price)}
             </span>
          </div>

          <Button
            onClick={() => onAddToCart(item)}
            disabled={isSoldOut}
            className="w-full h-16 rounded-s2xl bg-stone-800 text-white hover:bg-stone-700 font-black uppercase italic tracking-widest transition-all shadow-[6px_6px_0px_0px_#f59e0b] active:shadow-none active:translate-x-1 active:translate-y-1 text-lg disabled:bg-stone-300 disabled:shadow-none disabled:text-stone-500 disabled:cursor-not-allowed"
          >
            {isSoldOut ? 'Unavailable' : 'Add to Order'}
          </Button>
        </div>
      </div>
    </div>
  );
}
