"use client"

import { useEffect, useState, useRef } from 'react';
import { useFirestore } from '@/firebase';
import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  serverTimestamp, 
  arrayUnion, 
  increment,
  collection,
  getDocs
} from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import { 
  ChefHat, 
  CheckCircle2, 
  Timer, 
  Play, 
  Clock, 
  Hash, 
  Utensils, 
  MessageCircleQuestion, 
  PlusCircle, 
  BellRing, 
  X, 
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  Coffee
} from 'lucide-react';

interface PastryPipe {
  x: number;
  top: number;
  bottom: number;
  passed: boolean;
}

export default function OrderStatusPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();

  // UI & Game State
  const [status, setStatus] = useState('Pending');
  const [orderData, setOrderData] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [helpLoading, setHelpLoading] = useState(false);
  
  // --- MENU & SEARCH STATES ---
  const [showOrderMore, setShowOrderMore] = useState(false);
  const [fullMenu, setFullMenu] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // --- NEW TIMER STATE ---
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastStatus = useRef<string>('Pending');

  // 1. Fetch Menu
  useEffect(() => {
    if (!firestore) return;
    const fetchMenu = async () => {
      setLoadingMenu(true);
      try {
        const querySnapshot = await getDocs(collection(firestore, "menu_items"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFullMenu(items);
        const categories = [...new Set(items.map(i => i.category || 'General'))];
        if (categories.length > 0) setExpandedCategories({ [categories[0]]: true });
      } catch (err) { console.error("Error fetching menu items:", err); } 
      finally { setLoadingMenu(false); }
    };
    fetchMenu();
  }, [firestore]);

  // --- 2. PERSISTENT TIMER LOGIC ---
  useEffect(() => {
    if (!isTimerRunning || !id) return;

    const timerKey = `end_timer_${id}`;
    let savedEndTime = localStorage.getItem(timerKey);

    if (!savedEndTime) {
      const newEndTime = (Date.now() + 180000).toString();
      localStorage.setItem(timerKey, newEndTime);
      savedEndTime = newEndTime;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const end = parseInt(savedEndTime!);
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem(timerKey);
        router.push('/thanks'); 
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, id, router]);

  // 3. Search & Grouping
  const filteredMenu = fullMenu.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const groupedMenu = filteredMenu.reduce((acc: Record<string, any[]>, item) => {
    const cat = item.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // 4. Firebase Sync
  useEffect(() => {
    if (!id || !firestore) return;
    const unsub = onSnapshot(doc(firestore, "orders", id), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.status === 'Ready' && lastStatus.current !== 'Ready') {
          if (audioRef.current) audioRef.current.play().catch(() => {});
          if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
        }
        
        if (data.status === 'Served' && !isTimerRunning) {
          setIsTimerRunning(true);
        }

        lastStatus.current = data.status;
        setStatus(data.status);
        setOrderData(data);
      }
    });
    return () => unsub();
  }, [id, firestore, isTimerRunning]);

  // 5. Logic Handlers
  const addMoreFood = async (item: any) => {
    if (!firestore) return;
    const orderRef = doc(firestore, "orders", id);
    try {
      await updateDoc(orderRef, {
        items: arrayUnion({ name: item.name, quantity: 1, price: item.price, status: "Pending", addedAt: new Date().toISOString() }),
        totalPrice: increment(item.price),
        status: "Pending" 
      });
      setShowOrderMore(false);
    } catch (err) { console.error(err); }
  };

  const requestHelp = async () => {
    if (helpLoading || orderData?.helpRequested || !firestore) return;
    setHelpLoading(true);
    try {
      await updateDoc(doc(firestore, "orders", id), { helpRequested: true, helpRequestedAt: serverTimestamp() });
    } finally { setHelpLoading(false); }
  };

  const startAndUnmute = () => {
    if (audioRef.current) { audioRef.current.play().then(() => { audioRef.current?.pause(); audioRef.current!.currentTime = 0; }); }
    setScore(0); setGameActive(true); setIsCrashed(false);
  };

  // 6. Game Logic
  useEffect(() => {
    if (!gameActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let animationFrameId: number;
    let birdY = canvas.height / 2;
    let velocity = 0;
    const gravity = 0.25; 
    const lift = -6;      
    let pipes: PastryPipe[] = [];
    let frameCount = 0;
    const birdX = 80;
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#261711"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      velocity += gravity; birdY += velocity;
      ctx.font = "45px serif"; ctx.textAlign = "center";
      ctx.fillText(gameActive ? "🥐" : "💥", birdX, birdY);
      if (frameCount % 120 === 0) {
        const gap = 240; 
        const top = Math.random() * (canvas.height - gap - 100) + 50;
        pipes.push({ x: canvas.width, top, bottom: top + gap, passed: false });
      }
      pipes.forEach((p) => {
        p.x -= 2.5; ctx.fillStyle = "#f59e0b";
        ctx.fillRect(p.x, 0, 60, p.top); ctx.fillRect(p.x, p.bottom, 60, canvas.height - p.bottom);
        if (birdX + 20 > p.x && birdX - 20 < p.x + 60 && (birdY - 20 < p.top || birdY + 20 > p.bottom)) { setGameActive(false); setIsCrashed(true); }
        if (!p.passed && p.x + 60 < birdX) { setScore(prev => prev + 1); p.passed = true; }
      });
      if (birdY > canvas.height || birdY < 0) { setGameActive(false); setIsCrashed(true); }
      pipes = pipes.filter(p => p.x > -100); frameCount++;
      animationFrameId = window.requestAnimationFrame(gameLoop);
    };
    const handleJump = (e: any) => { e.preventDefault(); if(gameActive) velocity = lift; };
    window.addEventListener('touchstart', handleJump, { passive: false });
    window.addEventListener('mousedown', handleJump);
    animationFrameId = window.requestAnimationFrame(gameLoop);
    return () => { window.cancelAnimationFrame(animationFrameId); window.removeEventListener('touchstart', handleJump); window.removeEventListener('mousedown', handleJump); };
  }, [gameActive]);

  return (
    <div className={`fixed inset-0 bg-stone-900 font-sans overflow-hidden ${showOrderMore ? 'touch-auto' : 'touch-none'}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />

      {/* --- HEADER UI --- */}
      <div className={`absolute top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50 flex flex-col gap-4 transition-all duration-700 transform ${gameActive ? '-translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="flex gap-2">
          <div className="bg-white border-4 border-stone-800 rounded-[1.5rem] p-4 flex flex-col items-center justify-center shadow-[4px_4px_0_0_#f59e0b]">
            <p className="text-[10px] font-black uppercase text-stone-400 leading-none mb-1">Table</p>
            <p className="text-3xl font-black italic text-stone-800 leading-none">{orderData?.tableId}</p>
          </div>
          <div className="flex-1 bg-stone-800 border-4 border-amber-500 rounded-[1.5rem] p-4 flex flex-col items-center justify-center">
            <p className="text-[10px] font-black uppercase text-amber-500/50 leading-none mb-1">Order Number</p>
            <p className="text-3xl font-black italic text-amber-500 leading-none tracking-tighter">#{orderData?.orderNumber}</p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="bg-stone-900/90 backdrop-blur-md border-4 border-stone-800 rounded-[2.5rem] p-4 shadow-2xl">
          <div className="relative h-14 w-full bg-stone-800 rounded-2xl overflow-hidden border-2 border-stone-700">
            <div 
              className={`h-full transition-all duration-1000 ${
                status === 'Pending' ? 'bg-rose-500' : status === 'Served' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: status === 'Pending' ? '30%' : status === 'Served' ? '100%' : '65%' }}
            />
            <div className="absolute inset-0 flex items-center justify-center gap-3">
              <span className="text-sm font-black uppercase italic text-white drop-shadow-md">
                {status === 'Pending' ? 'Waiting Approval' : status === 'Served' ? 'ENJOY YOUR TREATS!' : 'Baking Now'}
              </span>
            </div>
          </div>
          
          {isTimerRunning && (
            <div className="mt-3 flex items-center justify-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest animate-pulse">
               <Clock size={14}/> Closing in: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          )}
        </div>
      </div>

      {/* --- ACTION BAR --- */}
      {!gameActive && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50 flex gap-3 animate-in fade-in slide-in-from-bottom duration-500">
          <button onClick={() => setShowOrderMore(true)} className="flex-1 bg-stone-800 border-4 border-white text-white rounded-[1.5rem] p-4 flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
            <PlusCircle size={20} className="text-amber-500" />
            <span className="text-xs font-black uppercase italic">Order More</span>
          </button>
          
          <button onClick={requestHelp} className={`flex-1 border-4 rounded-[1.5rem] p-4 flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all ${orderData?.helpRequested ? 'bg-emerald-500 border-emerald-600 text-white animate-pulse' : 'bg-amber-500 border-stone-800 text-stone-800'}`}>
            {orderData?.helpRequested ? <BellRing size={20} /> : <MessageCircleQuestion size={20} />}
            <span className="text-xs font-black uppercase italic">{orderData?.helpRequested ? 'Coming!' : 'Help'}</span>
          </button>
        </div>
      )}

      {/* --- ORDER MORE POPUP --- */}
      {showOrderMore && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end">
          <div className="w-full bg-white rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300 border-t-8 border-amber-500 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 text-stone-800">
              <h2 className="text-3xl font-black uppercase italic leading-none">Add to Bill</h2>
              <button onClick={() => setShowOrderMore(false)} className="p-2 bg-stone-100 rounded-full"><X size={24} /></button>
            </div>
            
            <div className="relative mb-6 text-stone-800">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input type="text" placeholder="Search menu..." className="w-full pl-12 pr-4 py-4 bg-stone-100 border-4 border-stone-100 rounded-2xl font-bold outline-none focus:border-amber-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-6">
              {loadingMenu ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-amber-500" size={32} /></div> : Object.keys(groupedMenu).map((cat) => (
                <div key={cat} className="space-y-2">
                  <button onClick={() => toggleCategory(cat)} className="w-full flex justify-between bg-stone-800 p-4 rounded-xl text-white font-black uppercase italic text-[10px] items-center tracking-widest">
                    <span>{cat} ({groupedMenu[cat].length})</span>
                    {expandedCategories[cat] ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                  </button>
                  {expandedCategories[cat] && groupedMenu[cat].map((item) => (
                    <button key={item.id} onClick={() => addMoreFood(item)} className="w-full flex justify-between items-center p-4 bg-stone-50 border-4 border-stone-100 rounded-2xl hover:border-amber-500 transition-all">
                      <span className="text-sm font-black uppercase italic text-stone-800">{item.name}</span>
                      <div className="flex items-center gap-3 text-stone-800"><span className="font-bold text-stone-400">₹{item.price}</span><PlusCircle size={20} /></div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- GAME OVERLAY --- */}
      {!gameActive && !showOrderMore && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-8">
          <div className="bg-white border-8 border-stone-800 p-8 rounded-[4rem] shadow-[15px_15px_0_0_#f59e0b] text-center space-y-6 max-w-sm animate-in zoom-in-95 duration-300">
            {isCrashed ? <div className="text-8xl">💥</div> : <div className="text-8xl animate-bounce">🥐</div>}
            <h2 className="text-5xl font-black uppercase italic text-stone-800 leading-none">PASTRY POP</h2>
            <button onClick={startAndUnmute} className="w-full bg-amber-500 text-stone-800 py-6 rounded-3xl font-black uppercase italic text-2xl shadow-[0_8px_0_0_#b45309] active:shadow-none active:translate-y-1 transition-all">PLAY NOW</button>
          </div>
        </div>
      )}

      {/* --- HUD --- */}
      {gameActive && (
        <div className="absolute bottom-10 left-10 z-50 flex items-baseline gap-2 pointer-events-none bg-black/40 p-4 rounded-3xl backdrop-blur-sm border border-white/10">
          <span className="text-7xl font-black italic text-amber-500 drop-shadow-[4px_4px_0_#000] leading-none">{score}</span>
          <span className="text-xs font-black text-white uppercase tracking-widest">Points</span>
        </div>
      )}
    </div>
  );
}
