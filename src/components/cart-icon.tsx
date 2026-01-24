"use client"

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { CartItem } from "@/lib/types";

type CartIconProps = {
  onOpen: () => void;
};

export function CartIcon({ onOpen }: { onOpen: () => void }) {
  const { totalItems } = useCart();

  return (
    <Button
      onClick={onOpen}
      aria-label="Open cart"
      className="relative h-12 w-12 rounded-full border-2 border-foreground bg-card text-foreground shadow-[2px_2px_0px_#000] hover:bg-accent hover:text-accent-foreground active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground border-2 border-foreground text-sm">
          {totalItems}
        </span>
      )}
    </Button>
  );
}
