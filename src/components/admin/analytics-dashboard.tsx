"use client"

import { useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Order } from '@/lib/types';
import { 
    Banknote, // Add this
    ShoppingBag, 
    Utensils, 
    TrendingUp, 
    Calendar,
    ChevronRight
  } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Calculations ---
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const totalOrders = orders.length;
  const takeawayCount = orders.filter(o => o.tableId === 'Takeaway' || !o.tableId).length;
  const dineInCount = totalOrders - takeawayCount;
  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

  if (loading) {
    return <div className="p-10 text-center font-black uppercase italic animate-pulse">Calculating Profits...</div>;
  }

  return (
    <div className="space-y-8 pb-20">
      {/* 1. TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard 
    title="Total Revenue" 
    value={`₹${totalRevenue.toLocaleString()}`} 
    icon={<Banknote size={24} />} // Changed from DollarSign
    color="bg-emerald-500" 
  />
        <StatCard 
          title="Total Orders" 
          value={totalOrders} 
          icon={<TrendingUp size={24} />} 
          color="bg-zinc-900" 
        />
        <StatCard 
          title="Dine-In" 
          value={dineInCount} 
          icon={<Utensils size={24} />} 
          color="bg-[#d4af37]" 
          textColor="text-zinc-900"
        />
        <StatCard 
          title="Take-Away" 
          value={takeawayCount} 
          icon={<ShoppingBag size={24} />} 
          color="bg-zinc-900" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. RECENT TRANSACTIONS (Large Section) */}
        <div className="lg:col-span-2 bg-white border-4 border-zinc-900 rounded-[2.5rem] shadow-[8px_8px_0_0_#000] overflow-hidden">
          <div className="p-8 border-b-2 border-zinc-100 flex justify-between items-center bg-zinc-50">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Recent Sales</h3>
            <div className="px-4 py-1 bg-zinc-900 text-[#d4af37] rounded-full text-[10px] font-black uppercase tracking-widest">
              Live Feed
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400 border-b">
                <tr>
                  <th className="px-8 py-4 text-left">Source</th>
                  <th className="px-8 py-4 text-left">Items</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black uppercase italic text-zinc-900 leading-none">
                        {order.tableId === 'Takeaway' ? '🥡 Takeaway' : `🪑 Table ${order.tableId}`}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase">
                        {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-zinc-500">
                        {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="font-black text-lg">₹{order.totalPrice}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. QUICK INSIGHTS (Sidebar Section) */}
        <div className="space-y-6">
          <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] border-4 border-zinc-900 shadow-[8px_8px_0_0_#d4af37]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-2">Performance</p>
            <h3 className="text-3xl font-black uppercase italic leading-none mb-6">Store Health</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Avg. Order Value</p>
                <p className="text-3xl font-black italic">₹{averageOrderValue}</p>
              </div>
              
              <div className="pt-6 border-t border-zinc-800">
                <p className="text-[10px] font-bold uppercase text-zinc-500 mb-3">Order Split</p>
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-zinc-800">
                  <div 
                    className="bg-[#d4af37]" 
                    style={{ width: `${(dineInCount / totalOrders) * 100}%` }} 
                  />
                  <div 
                    className="bg-emerald-500" 
                    style={{ width: `${(takeawayCount / totalOrders) * 100}%` }} 
                  />
                </div>
                <div className="flex justify-between mt-2 text-[9px] font-black uppercase">
                  <span className="text-[#d4af37]">Dine-In</span>
                  <span className="text-emerald-500">Takeaway</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-zinc-900 p-8 rounded-[2.5rem] flex items-center justify-between group cursor-pointer hover:bg-zinc-900 hover:text-white transition-all">
            <div className="flex items-center gap-4">
              <Calendar className="text-[#d4af37]" />
              <span className="font-black uppercase italic">Daily Report</span>
            </div>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Sub-Component ---
function StatCard({ title, value, icon, color, textColor = "text-white" }: any) {
  return (
    <div className="bg-white border-4 border-zinc-900 p-6 rounded-[2.5rem] shadow-[6px_6px_0_0_#000] flex items-center gap-5">
      <div className={`${color} ${textColor} p-4 rounded-2xl border-2 border-zinc-900 shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-none">{title}</p>
        <p className="text-3xl font-black italic text-zinc-900 mt-1 leading-none">{value}</p>
      </div>
    </div>
  );
}