export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-theme bg-background text-foreground min-h-screen">
      {children}
    </div>
  );
}
