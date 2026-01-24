"use client"

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Order } from '@/lib/types';
import { OrderCard } from '@/components/admin/order-card';
import { Button } from '@/components/ui/button';
import { LogOut, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuth, setAuth] = useLocalStorage('grillicious-admin-auth', false);
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuth) {
      router.replace('/admin/login');
    }
  }, [isAuth, isMounted, router]);
  
  const handleStatusUpdate = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    toast({
      title: 'Order Updated',
      description: `Order ${orderId.split('-')[0]} is now ${status}.`,
    });
  }, [setOrders, toast]);

  const handleLogout = () => {
    setAuth(false);
    router.push('/admin/login');
  };
  
  if (!isMounted || !isAuth) {
    return <div className="flex h-screen items-center justify-center">Authenticating...</div>;
  }
  
  const activeOrders = orders.filter(o => o.status !== 'Completed');

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4"/>
            Logout
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {activeOrders.length === 0 ? (
          <div className="text-center py-20 rounded-lg border-2 border-dashed border-muted-foreground/30">
            <WifiOff className="mx-auto h-12 w-12 text-muted-foreground"/>
            <h2 className="mt-4 text-xl font-semibold text-muted-foreground">No active orders</h2>
            <p className="mt-2 text-sm text-muted-foreground">Waiting for new orders to come in...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeOrders.sort((a, b) => a.timestamp - b.timestamp).map(order => (
              <OrderCard key={order.id} order={order} onStatusUpdate={handleStatusUpdate} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
