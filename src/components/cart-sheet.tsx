"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/lib/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

type CartSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tableId: string;
};

export function CartSheet({ isOpen, onOpenChange, tableId }: CartSheetProps) {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const { toast } = useToast();

  const handlePlaceOrder = () => {
    const newOrder: Order = {
      id: `${tableId}-${Date.now()}`,
      tableId,
      items: cartItems,
      totalPrice: cartTotal,
      status: 'Received',
      timestamp: Date.now(),
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
    toast({
      title: "Order Received! 🔥",
      description: "We're starting on your food right now.",
    });
    clearCart();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {/* KEY CHANGE: 
          - Changed w-full to w-[80vw] for mobile
          - border-l-4 adds that theme color strip
      */}
      <SheetContent 
        side="right" 
        className="flex flex-col bg-zinc-900 border-l-4 border-[#d4af37] text-white w-[80vw] sm:max-w-md p-0"
      >
        
        <SheetHeader className="p-6 border-b border-zinc-800">
          <SheetTitle className="text-xl font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
            <ShoppingBag className="text-[#d4af37] h-5 w-5" /> Your Order
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-30 space-y-4">
              <ShoppingBag size={40} />
              <p className="text-center font-bold uppercase tracking-widest text-[10px]">Empty</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-5">
                  <div className="relative h-14 w-14 shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="rounded-lg object-cover border border-zinc-700"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-black uppercase italic tracking-tight text-xs truncate leading-none mb-1">
                      {item.name}
                    </p>
                    <p className="text-emerald-500 font-bold text-xs">
                      {formatCurrency(item.price)}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-zinc-800 rounded border border-zinc-700">
                        <button 
                          className="p-1 hover:text-[#d4af37]"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3"/>
                        </button>
                        <span className="w-6 text-center font-bold text-[10px]">{item.quantity}</span>
                        <button 
                          className="p-1 hover:text-[#d4af37]"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3"/>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="p-1 text-zinc-600"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4"/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <SheetFooter className="bg-zinc-800/80 p-5 mt-auto">
            <div className="w-full space-y-4">
              <div className="flex flex-col gap-0 text-center">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-500">Total</span>
                <div className="text-3xl font-black text-emerald-500 tracking-tighter tabular-nums">
                  {formatCurrency(cartTotal)}
                </div>
              </div>
              
              <Button
                onClick={handlePlaceOrder}
                className="w-full h-14 text-sm font-black uppercase italic tracking-widest bg-[#d4af37] text-zinc-900 hover:bg-white rounded-xl shadow-lg active:scale-95 transition-all"
              >
                Order Now
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}