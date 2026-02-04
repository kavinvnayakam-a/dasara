"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import Image from 'next/image';

export default function TableSelection() {
  const router = useRouter();
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleSelectTable = (tableNumber: number) => {
    router.push(`/?table=${tableNumber}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100 p-4 selection:bg-stone-800 selection:text-white">
      
      <Card className="w-full max-w-2xl border-4 border-stone-800 bg-white shadow-[12px_12px_0px_0px_#1c1917] rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center pt-10 pb-6">
          <div className="mx-auto bg-stone-800 text-white w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Welcome
          </div>
          <div className="bg-white rounded-full p-4 inline-block mx-auto">
            <Image src="https://firebasestorage.googleapis.com/v0/b/swissdelights-2a272.firebasestorage.app/o/Swiss_logo.webp?alt=media&token=70912942-ad4e-4840-9c22-99ab267c42c6" alt="Swiss Delight" width={250} height={63} />
          </div>
          <CardDescription className="text-sm font-bold text-stone-500 uppercase tracking-widest pt-3">
            Select your table to start
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {tables.map((table) => (
              <Button
                key={table}
                onClick={() => handleSelectTable(table)}
                className="
                  h-20 text-3xl font-black 
                  bg-white text-stone-800 
                  border-2 border-stone-800 
                  rounded-2xl
                  shadow-[4px_4px_0px_0px_#1c1917] 
                  hover:bg-amber-500 hover:text-stone-800 
                  active:shadow-none active:translate-x-1 active:translate-y-1 
                  transition-all
                "
              >
                {table}
              </Button>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              A taste of sweetness.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
