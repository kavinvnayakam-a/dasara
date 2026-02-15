import CustomerView from '@/components/customer-view';
import { Suspense } from 'react';
import Image from 'next/image';

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/dasara-finedine.firebasestorage.app/o/Art%20Cinemas%20Logo.jpeg?alt=media&token=0e8ee706-4ba1-458d-b2b9-d85434f8f2ba";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const screen = typeof resolvedParams.screen === 'string' ? resolvedParams.screen : null;
  const seat = typeof resolvedParams.seat === 'string' ? resolvedParams.seat : null;
  
  // Composite tableId for internal logic compatibility
  const tableId = screen && seat ? `Screen ${screen} - Seat ${seat}` : null;

  return (
    <Suspense 
      fallback={
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse" />
            
            <div className="relative bg-zinc-900 p-6 rounded-full border border-primary/20">
              <Image 
                src={LOGO_URL} 
                alt="ART Cinemas Logo" 
                width={80} 
                height={80} 
                className="animate-in fade-in zoom-in duration-700 rounded-full" 
              />
            </div>
          </div>
          <p className="mt-8 text-primary font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">
            Loading Cinematic Experience...
          </p>
        </div>
      }
    >
      <CustomerView tableId={tableId} mode="dine-in" />
    </Suspense>
  );
}
