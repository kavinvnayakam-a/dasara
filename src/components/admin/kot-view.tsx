
"use client"

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { 
  collection, onSnapshot, query, orderBy, doc, 
  updateDoc, writeBatch, serverTimestamp, getDoc 
} from 'firebase/firestore';
import { Order } from '@/lib/types';
import { 
  CheckCircle2, Clock, Check, ChefHat, LayoutGrid
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function KotView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore) return;
    const q = query(collection(firestore, "orders"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]);
    });
    return () => unsubscribe();
  }, [firestore]);

  const approveOrder = async (orderId: string) => {
    if (!firestore) return;
    await updateDoc(doc(firestore, "orders", orderId), { status: "Received" });
    toast({ title: "Order Approved" });
  };

  const markItemServed = async (orderId: string, itemIndex: number) => {
    if (!firestore) return;
    const orderRef = doc(firestore, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) return;
    
    const items = [...orderSnap.data().items];
    items[itemIndex].status = "Served";
    await updateDoc(orderRef, { items });
  };

  const completeTicket = async (orderId: string) => {
    if (!firestore) return;
    const orderRef = doc(firestore, "orders", orderId);
    const snap = await getDoc(orderRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const batch = writeBatch(firestore);
    batch.set(doc(collection(firestore, "order_history")), { 
      ...data, 
      status: "Completed",
      archivedAt: serverTimestamp() 
    });
    batch.delete(orderRef);
    await batch.commit();

    toast({ title: "KOT Completed & Archived" });
  };

  const formatOrderTime = (ts: any) => {
    if (!ts) return "";
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const activeOrders = orders.filter(o => o.status !== 'Completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
            <ChefHat className="text-black" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">Production Queue</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Kitchen Tickets</p>
          </div>
        </div>
        
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-black text-primary italic leading-none">{activeOrders.length}</span>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-tight">Live<br/>Orders</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeOrders.length > 0 ? (
          activeOrders.map((order) => (
            <div key={order.id} className={cn(
              "bg-zinc-900/40 border-2 rounded-[2.5rem] p-8 relative flex flex-col transition-all shadow-2xl overflow-hidden group hover:border-primary/30",
              order.helpRequested ? 'border-red-500 shadow-red-500/10' : 'border-zinc-800'
            )}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border border-primary/20">
                      {order.tableId}
                    </span>
                    <span className="text-zinc-500 text-[9px] font-bold uppercase">#{order.orderNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase">
                    <Clock size={12}/> {formatOrderTime(order.timestamp)}
                  </div>
                </div>
                
                <div className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase border",
                  order.status === 'Pending' ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                )}>
                  {order.status}
                </div>
              </div>

              <div className="space-y-3 flex-1 mb-8">
                {order.items.map((item, idx) => (
                  <div key={idx} className={cn(
                    "flex justify-between items-center p-4 rounded-2xl border transition-all",
                    item.status === 'Served' ? 'bg-emerald-500/5 border-emerald-500/10 opacity-40' : 'bg-black/20 border-zinc-800 group-hover:border-zinc-700'
                  )}>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-black italic text-sm">{item.quantity}x</span>
                      <span className={cn("text-xs font-bold uppercase italic", item.status === 'Served' ? 'line-through text-zinc-500' : 'text-zinc-100')}>
                         {item.name}
                      </span>
                    </div>
                    {item.status !== 'Served' && order.status !== 'Pending' && (
                      <button 
                        onClick={() => markItemServed(order.id, idx)} 
                        className="bg-zinc-800 text-primary border border-primary/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase italic hover:bg-primary hover:text-black transition-all"
                      >
                        Serve
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {order.status === 'Pending' ? (
                  <button onClick={() => approveOrder(order.id)} className="w-full bg-primary text-black py-4 rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all">
                    <Check size={18}/> Approve KOT
                  </button>
                ) : (
                  <button 
                    onClick={() => completeTicket(order.id)} 
                    className="w-full bg-zinc-800 text-zinc-400 border border-zinc-700 py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all shadow-xl"
                  >
                    <CheckCircle2 size={16}/> Complete Ticket
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full h-80 flex flex-col items-center justify-center bg-zinc-900/20 border-4 border-dashed border-zinc-800 rounded-[3rem] text-center">
            <ChefHat size={48} className="text-zinc-800 mb-4" />
            <h3 className="text-xl font-black uppercase italic text-zinc-700">Kitchen is Quiet</h3>
            <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest mt-2">Waiting for next blockbuster order</p>
          </div>
        )}
      </div>
    </div>
  );
}
