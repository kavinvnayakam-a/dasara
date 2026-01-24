import CustomerView from '@/components/customer-view';
import { Suspense } from 'react';

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tableId = typeof searchParams.table === 'string' ? searchParams.table : null;

  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-background text-foreground">Loading...</div>}>
      <CustomerView tableId={tableId} />
    </Suspense>
  );
}
