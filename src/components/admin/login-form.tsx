"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { haversineDistance } from "@/lib/utils";
import { Loader2, Unlock } from "lucide-react";

// Hardcoded restaurant location (e.g., Googleplex)
const RESTAURANT_LOCATION = {
  latitude: 37.422,
  longitude: -122.084,
};
const MAX_DISTANCE_METERS = 100;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [, setAuth] = useLocalStorage('grillicious-admin-auth', false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Error",
        description: "Geolocation is not supported by your browser.",
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = haversineDistance(
          latitude,
          longitude,
          RESTAURANT_LOCATION.latitude,
          RESTAURANT_LOCATION.longitude
        );

        if (distance <= MAX_DISTANCE_METERS) {
          toast({
            title: "Access Granted",
            description: "Welcome to the admin dashboard.",
          });
          setAuth(true);
          router.push("/admin");
        } else {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: `You must be within ${MAX_DISTANCE_METERS} meters of the restaurant. You are ${Math.round(distance)}m away.`,
          });
          setIsLoading(false);
        }
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Geolocation Error",
          description: error.message,
        });
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Grillicious Admin</CardTitle>
        <CardDescription>Login requires you to be at the restaurant location.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleLogin} disabled={isLoading} className="w-full h-12 text-lg">
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Unlock className="mr-2 h-5 w-5" />}
          Verify Location & Login
        </Button>
      </CardContent>
    </Card>
  );
}
