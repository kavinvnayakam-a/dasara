"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Heart, Instagram, MessageCircle, Facebook, Star, QrCode } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function ThankYouPage() {
  const router = useRouter();

  // Prevent back button navigation
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6 text-stone-800 font-sans">
      <div className="w-full max-w-md bg-white border-4 border-stone-800 rounded-[3rem] p-8 shadow-[12px_12px_0px_0px_#261711] text-center text-stone-800">
        
        <div className="mb-6 flex justify-center">
          <div className="bg-stone-800 p-4 rounded-full animate-pulse">
            <Heart className="h-8 w-8 text-amber-500 fill-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-full p-4 inline-block mx-auto mb-2">
          <Image src="https://firebasestorage.googleapis.com/v0/b/swissdelights-2a272.firebasestorage.app/o/Swiss_logo.webp?alt=media&token=70912942-ad4e-4840-9c22-99ab267c42c6" alt="Swiss Delight Logo" width={250} height={63} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-6">
          A taste of sweetness.
        </p>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold leading-tight">
            The cup is empty, but the <span className="italic underline decoration-amber-500 decoration-4">aroma lingers.</span>
          </h2>
          <p className="text-sm font-medium text-stone-600">
            Thank you for sharing a moment of sweetness with us. Your visit makes our day brighter!
          </p>
        </div>

        <Link 
          href="https://maps.app.goo.gl/a2fZ7znN8HuEmCsC6" 
          target="_blank"
          className="block w-full bg-stone-800 text-white p-6 rounded-2xl border-2 border-stone-800 shadow-[4px_4px_0px_0px_#f59e0b] active:translate-y-1 active:shadow-none transition-all mb-8 group"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
            ))}
          </div>
          <span className="font-black uppercase tracking-widest text-xs">Rate our Cafe on Google</span>
        </Link>

        <div className="flex justify-center gap-6 mb-10">
          <Link href="#" className="p-3 bg-stone-100 rounded-xl hover:bg-amber-500 transition-colors">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" className="p-3 bg-stone-100 rounded-xl hover:bg-amber-500 transition-colors">
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="#" className="p-3 bg-stone-100 rounded-xl hover:bg-amber-500 transition-colors">
            <MessageCircle className="h-6 w-6" />
          </Link>
        </div>

        <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl p-5">
          <div className="flex items-center justify-center gap-2 text-stone-400 mb-2">
            <QrCode className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Craving more?</span>
          </div>
          <p className="text-xs font-bold text-stone-500 italic">
            "To continue ordering or start a new session, please scan the QR code on your table once more."
          </p>
        </div>
      </div>

      <Link href="https://www.getpik.in/" target="_blank" className="group mt-8 flex flex-col items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500/80">Designed By</span>
        <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-2xl border-2 border-stone-800 shadow-[4px_4px_0_0_#1c1917]">
          <span className="text-stone-800 font-black text-xl tracking-tight">GetPik</span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </Link>
    </div>
  );
}
