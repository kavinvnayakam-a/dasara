"use client"

import { useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useSessionTimer = (
  onIdle: () => void,
  timeoutInMs: number = 900000 // 15 minutes
) => {
  const { toast } = useToast();
  const timeoutId = useRef<NodeJS.Timeout>();

  const resetTimer = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    
    timeoutId.current = setTimeout(() => {
      toast({
        title: "Session Expired",
        description: "Your cart has been cleared due to inactivity. The page will now refresh.",
        variant: "destructive",
        duration: 5000,
      });
      // Call the idle callback and then refresh
      onIdle();
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }, timeoutInMs);
  }, [timeoutInMs, onIdle, toast]);

  useEffect(() => {
    const events: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));
    resetTimer(); // Start the timer on mount

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [resetTimer]);

  return { resetTimer };
};
