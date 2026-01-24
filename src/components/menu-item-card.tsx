"use client"

import Image from "next/image";
import type { MenuItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type MenuItemCardProps = {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
};

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border-4 border-foreground shadow-[8px_8px_0px_#000] overflow-hidden transition-transform hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          data-ai-hint={item.imageHint}
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold">{item.name}</h3>
        <p className="text-muted-foreground mt-2 min-h-[40px]">{item.description}</p>
        <div className="flex justify-between items-center mt-6">
          <span className="text-2xl font-bold">{formatCurrency(item.price)}</span>
          <Button
            onClick={() => onAddToCart(item)}
            className="h-12 px-6 bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
