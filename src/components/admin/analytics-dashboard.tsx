"use client"

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, onSnapshot, query, orderBy, where, Timestamp, getDocs } from 'firebase/firestore';
import { Order } from '@/lib/types';
import { 
    Banknote, 
    TrendingUp, 
    Calendar,
    Film
  } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsDashboard() {
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) return;
    setLoading(true);
    
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    const qLive = query(
      collection(firestore, "orders"), 
      where("timestamp", ">=", Timestamp.fromDate(start)),
      where("timestamp", "<=", Timestamp.fromDate(end))
    );

    const unsubLive = onSnapshot(qLive, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
      setLiveOrders(data);
    });

    const fetchHistory = async () => {
      try {
        const qHist = query(
          collection(firestore, "order_history"),
          where("timestamp", ">=", Timestamp.fromDate(start)),
          where("timestamp", "<=", Timestamp.fromDate(end)),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(qHist);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
        setHistoryOrders(data);
      } catch (e) {
        console.error("History fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    return () => unsubLive();
  }, [selectedDate, firestore]);

  const allOrders = [...liveOrders, ...historyOrders];
  const totalRevenue = allOrders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
  const totalOrders = allOrders.length;
  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      
      <div className="bg-primary/10 p-6 rounded-[2rem] border-4 border-slate-900 shadow-[6px_6px_0_0_#000] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="text-primary" size={20} />
          <h3 className="font-black uppercase italic text-slate-900">Analysis for:</h3>
        </div>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-white border-4 border-slate-900 rounded-xl px-4 py-2 font-black uppercase text-slate-900 outline-none w-full md:w-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<Banknote size={24} />} />
        <StatCard title="Total Tickets" value={totalOrders} icon={<TrendingUp size={24} />} />
        <StatCard title="Avg per Seat" value={formatCurrency(averageOrderValue)} icon={<Film size={24} />} />
      </div>

      <div className="bg-white border-4 border-slate-900 rounded-[2.5rem] shadow-[8px_8px_0_0_#000] overflow-hidden">
        <div className="p-8 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black">In-Theater Transaction Log</h3>
          <div className="px-4 py-1 bg-slate-900 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
            Live Sync
          </div>
        </div>
        
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b sticky top-0">
              <tr>
                <th className="px-8 py-4 text-left">Status</th>
                <th className="px-8 py-4 text-left">Theater Location</th>
                <th className="px-8 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allOrders.length > 0 ? allOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                     <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                       order.status === 'Served' ? 'bg-emerald-100 text-emerald-600' : 'bg-primary/20 text-primary'
                     }`}>
                       {order.status === 'Served' ? 'Archived' : 'Active'}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black uppercase italic text-slate-900 leading-none">
                      {order.tableId}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">Order #{order.orderNumber || '0000'}</p>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-lg text-black">
                    {formatCurrency(order.totalPrice)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="py-20 text-center text-slate-300 font-black uppercase italic">No cinematic tickets for this date</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white border-4 border-slate-900 p-6 rounded-[2.5rem] shadow-[6px_6px_0_0_#000] flex items-center gap-5">
      <div className={`bg-slate-900 text-primary p-4 rounded-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">{title}</p>
        <p className="text-2xl font-black italic text-black mt-1 leading-none">{value}</p>
      </div>
    </div>
  );
}
