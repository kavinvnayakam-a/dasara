"use client"

import SessionTimer from "@/components/session-timer";
import Image from 'next/image';

type HeaderProps = {
  tableId: string | null;
  onCartClick: () => void;
  timeLeft: number;
};

export function Header({ tableId, timeLeft }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-stone-100 border-b-2 border-stone-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        <div className="flex flex-col">
          <div className="bg-white rounded-full p-1">
            <Image src="https://firebasestorage.googleapis.com/v0/b/swissdelights-2a272.firebasestorage.app/o/Swiss_logo.webp?alt=media&token=70912942-ad4e-4840-9c22-99ab267c42c6" alt="Swiss Delight Logo" width={140} height={35} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {tableId && (
            <>
              <div className="hidden md:flex items-center bg-stone-800 px-2.5 py-1 rounded-full border border-stone-700">
                <SessionTimer timeLeft={timeLeft} />
              </div>
              
              <div className="relative">
                <div className="
                  translate-y-4
                  flex flex-col items-center justify-center
                  min-w-[60px] h-[60px] 
                  rounded-2xl border-4 border-stone-800 
                  bg-stone-800 text-white
                  shadow-[4px_4px_0_0_#1c1917]
                ">
                  <span className="text-[9px] uppercase font-black leading-none mb-0.5">
                    Table
                  </span>
                  <span className="text-2xl font-black leading-none tracking-tighter">
                    {tableId}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
       {tableId && (
          <div className="md:hidden absolute top-20 right-4 bg-stone-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-stone-700 shadow-lg">
            <SessionTimer timeLeft={timeLeft} />
          </div>
        )}
    </header>
  );
}
