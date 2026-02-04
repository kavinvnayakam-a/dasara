"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Unlock, ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [, setAuth] = useLocalStorage('swiss-delight-admin-auth', false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDevLogin = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setAuth(true);
      router.push("/admin");
    }, 500);
  };

  return (
    <Card className="w-full max-w-md border-4 border-stone-800 bg-white shadow-[12px_12px_0px_0px_#1c1917] rounded-[2.5rem] overflow-hidden">
      <CardHeader className="text-center pt-10 pb-6">
        <div className="mx-auto bg-stone-800 p-4 rounded-2xl w-fit mb-4">
          <ShieldCheck className="w-8 h-8 text-amber-500" />
        </div>
        <CardTitle className="text-4xl font-black uppercase italic tracking-tighter text-stone-800 leading-none">
          Admin Portal
        </CardTitle>
        <CardDescription className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-3">
          Swiss Delight Cafe
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-tight">
            Login is for authorized personnel only.
          </p>
        </div>

        <Button 
          onClick={handleDevLogin} 
          disabled={isLoading} 
          className="w-full h-16 text-lg font-black uppercase tracking-widest bg-stone-800 hover:bg-stone-700 text-white rounded-2xl shadow-[4px_4px_0px_0px_#f59e0b] active:shadow-none active:translate-y-1 transition-all"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            <>
              <Unlock className="mr-2 h-6 w-6 text-amber-500" />
              Enter Dashboard
            </>
          )}
        </Button>
        
        <p className="text-[9px] text-center text-stone-400 font-bold uppercase tracking-widest">
          Swiss Delight Management System v1.0
        </p>
      </CardContent>
    </Card>
  );
}
