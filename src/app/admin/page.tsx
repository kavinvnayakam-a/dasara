import AdminDashboard from "@/components/admin/admin-dashboard";
import { Suspense } from "react";

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Dashboard...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
