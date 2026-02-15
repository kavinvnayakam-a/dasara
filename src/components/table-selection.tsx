"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import Image from 'next/image';
import { cn } from "@/lib/utils";

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/dasara-finedine.firebasestorage.app/o/Art%20Cinemas%20Logo.jpeg?alt=media&token=0e8ee706-4ba1-458d-b2b9-d85434f8f2ba";

export default function TableSelection() {
  const router = useRouter();
  const [selectedScreen, setSelectedScreen] = useState<number | null>(null);

  const screens = [1, 2, 3, 4, 5];
  const seats = [1, 2, 3, 4, 5];

  const handleSelectSeat = (seatNumber: number) => {
    if (selectedScreen) {
      router.push(`/?screen=${selectedScreen}&seat=${seatNumber}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40" />
      
      <Card className="w-full max-w-2xl border border-primary/20 bg-zinc-950/80 backdrop-blur-xl shadow-2xl rounded-[3rem] overflow-hidden relative z-10">
        <CardHeader className="text-center pt-16 pb-10">
          <div className="relative inline-block mx-auto p-1 bg-primary rounded-full shadow-2xl shadow-primary/20 mb-8">
            <Image src={LOGO_URL} alt="ART Cinemas" width={64} height={64} className="rounded-full" priority />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">ART Cinemas</h2>
            <CardDescription className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em] pt-2">
              {selectedScreen ? `Screen ${selectedScreen}: Select Seat` : "Select Your Screen"}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="p-10">
          {!selectedScreen ? (
            <div className="grid grid-cols-5 gap-4">
              {screens.map((screen) => (
                <button
                  key={screen}
                  onClick={() => setSelectedScreen(screen)}
                  className="
                    h-20 rounded-2xl text-xl font-black italic
                    bg-zinc-900 text-primary border border-primary/20
                    transition-all duration-300
                    hover:bg-primary hover:text-black hover:scale-105
                    active:scale-95 shadow-lg
                  "
                >
                  SCR {screen}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-5 gap-4">
                {seats.map((seat) => (
                  <button
                    key={seat}
                    onClick={() => handleSelectSeat(seat)}
                    className="
                      h-20 rounded-2xl text-xl font-black italic
                      bg-zinc-900 text-primary border border-primary/20
                      transition-all duration-300
                      hover:bg-primary hover:text-black hover:scale-105
                      active:scale-95 shadow-lg
                    "
                  >
                    SEAT {seat}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setSelectedScreen(null)}
                className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
              >
                ← Back to Screens
              </button>
            </div>
          )}
          
          <div className="mt-16 text-center flex flex-col items-center gap-4">
            <div className="h-px w-12 bg-primary/20 rounded-full" />
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-primary/20">
              PREMIUM CINEMATIC DINING
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
