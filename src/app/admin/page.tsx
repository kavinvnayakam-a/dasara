
"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import MenuManager from "@/components/admin/menu-manager"; 
import OrderManager from "@/components/admin/order-manager"; 
import KotView from "@/components/admin/kot-view";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";
import OrderHistory from "@/components/admin/order-history"; 
import AiMenuImporter from "@/components/admin/ai-menu-importer";
import MovieManager from "@/components/admin/movie-manager";
import { useFirestore } from "@/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { 
  LayoutDashboard, 
  LogOut, 
  Bell,
  Clock,
  MessageCircleQuestion,
  TrendingUp,
  Settings,
  ShieldCheck,
  Sparkles,
  Film,
  ChefHat,
  Tv
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/dasara-finedine.firebasestorage.app/o/Art%20Cinemas%20Logo.jpeg?alt=media&token=0e8ee706-4ba1-458d-b2b9-d85434f8f2ba";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'kot' | 'history' | 'menu' | 'analytics' | 'ai-import' | 'movies'>('orders');
  const [newOrderCount, setNewOrderCount] = useState(0);
  const firestore = useFirestore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
  }, []);

  useEffect(() => {
    if (!firestore) return;

    const qAllOrders = query(collection(firestore, "orders"));
    let isInitialLoad = true;

    const unsubSound = onSnapshot(qAllOrders, (snapshot) => {
      if (isInitialLoad) {
        isInitialLoad = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          audioRef.current?.play().catch(() => {});
          setNewOrderCount(prev => prev + 1);
        }
      });
    });
    
    return () => unsubSound();
  }, [firestore]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0A0A0A] font-sans selection:bg-primary selection:text-black text-zinc-100">
      
      {/* SIDEBAR */}
      <nav className="w-full md:w-72 bg-[#121212] flex md:flex-col z-40 border-r border-zinc-800 shadow-2xl">
        
        <div className="hidden md:flex flex-col items-center py-12 px-6">
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white p-1 rounded-full shadow-lg overflow-hidden w-20 h-20 border-2 border-primary/50">
               <Image src={LOGO_URL} alt="ART Cinemas" fill className="object-cover" />
            </div>
          </div>
          <h1 className="text-lg font-black uppercase tracking-[0.2em] text-white">ART Cinemas</h1>
          <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Management</span>
          </div>
        </div>

        <div className="flex md:flex-col flex-1 gap-2 p-4 md:px-6">
          <button 
            onClick={() => setActiveTab('orders')}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all relative",
              activeTab === 'orders' 
              ? "bg-primary text-black shadow-lg shadow-primary/10" 
              : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden md:inline">Live Tickets</span>
          </button>

          <button 
            onClick={() => { setActiveTab('kot'); setNewOrderCount(0); }}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all relative",
              activeTab === 'kot' 
              ? "bg-primary text-black shadow-lg shadow-primary/10" 
              : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <ChefHat className="w-5 h-5" />
            <span className="hidden md:inline">Kitchen (KOT)</span>
            {newOrderCount > 0 && activeTab !== 'kot' && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all",
              activeTab === 'history' 
              ? "bg-primary text-black shadow-lg shadow-primary/10" 
              : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <Clock className="w-5 h-5" />
            <span className="hidden md:inline">Archives</span>
          </button>

          <button 
            onClick={() => setActiveTab('menu')}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all",
              activeTab === 'menu' 
              ? "bg-primary text-black shadow-lg shadow-primary/10" 
              : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <Film className="w-5 h-5" />
            <span className="hidden md:inline">Menu Config</span>
          </button>

          <button 
            onClick={() => setActiveTab('movies')}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all",
              activeTab === 'movies' 
              ? "bg-primary text-black shadow-lg shadow-primary/10" 
              : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <Tv className="w-5 h-5" />
            <span className="hidden md:inline">Theater Ads</span>
          </button>

          <button 
            onClick={() => setActiveTab('ai-import')}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all",
              activeTab === 'ai-import' 
              ? "bg-primary text-black shadow-lg shadow-primary/10" 
              : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <Sparkles className="w-5 h-5" />
            <span className="hidden md:inline">AI Importer</span>
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all",
              activeTab === 'analytics' 
              ? "bg-primary text-black shadow-lg shadow-primary/10" 
              : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="hidden md:inline">Business</span>
          </button>
        </div>

        <div className="hidden md:block p-8 mt-auto">
          <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all group">
            <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Terminate Session</span>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        <header className="sticky top-0 z-30 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-zinc-800 px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
                Operations Console / {activeTab}
              </span>
              <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none">
                {activeTab === 'orders' ? 'Live Tickets' : activeTab === 'kot' ? 'Kitchen KOT' : activeTab === 'menu' ? 'Theater Menu' : activeTab === 'history' ? 'Order Archives' : activeTab === 'ai-import' ? 'AI Digitizer' : activeTab === 'movies' ? 'Theater Ads' : 'Intelligence Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-3 shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Online</span>
              </div>
              
              <button className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-2xl hover:bg-zinc-800 hover:text-primary transition-all">
                <Bell size={20} />
              </button>
              <button className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-2xl hover:bg-zinc-800 hover:text-primary transition-all">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <OrderManager />
              </div>
            )}

            {activeTab === 'kot' && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <KotView />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <OrderHistory />
              </div>
            )}
            
            {activeTab === 'menu' && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <MenuManager />
              </div>
            )}

            {activeTab === 'movies' && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <MovieManager />
              </div>
            )}

            {activeTab === 'ai-import' && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <AiMenuImporter />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <AnalyticsDashboard />
              </div>
            )}
          </div>
        </div>
        
        <footer className="py-12 px-8 bg-black/40 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-zinc-800 w-6 h-6" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Secure Admin Environment</span>
                <span className="text-[9px] font-bold text-zinc-700 uppercase">Hardware ID Verified</span>
              </div>
            </div>
            
            <Link href="https://www.getpik.in/" target="_blank" className="group flex flex-col items-center gap-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-zinc-600">Digital Architecture By</span>
                <div className="flex items-center gap-4 bg-zinc-900/50 px-8 py-3 rounded-2xl border border-zinc-800 transition-all group-hover:border-primary group-hover:bg-zinc-900 shadow-xl">
                    <span className="text-zinc-300 font-black text-lg tracking-tighter group-hover:text-primary transition-colors">GetPik</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
            </Link>
        </footer>
      </div>

      <Link href="mailto:info@getpik.in" className="fixed bottom-10 right-10 z-50 bg-primary text-black p-5 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all hover:bg-white">
          <MessageCircleQuestion className="h-7 w-7" />
          <span className="sr-only">Support</span>
      </Link>
    </div>
  );
}
