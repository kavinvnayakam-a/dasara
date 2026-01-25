import CustomerView from '@/components/customer-view';
import { Suspense } from 'react';

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tableId = typeof searchParams.table === 'string' ? searchParams.table : null;

  return (
    /* Styled Fallback to match your #d4af37 Mustard Yellow theme */
    <Suspense 
      fallback={
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#d4af37]">
          <div className="flex flex-col items-center gap-4">
             <div className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900 animate-pulse">
                Grillicious
             </div>
             <div className="h-1 w-12 bg-zinc-900 rounded-full animate-bounce" />
          </div>
        </div>
      }
    >
      <CustomerView tableId={tableId} />
    </Suspense>
  );
}