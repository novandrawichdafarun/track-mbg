import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* Margin kiri 64 (256px) untuk memberi ruang sidebar */}
      <main className="md:ml-64 min-h-screen">{children}</main>
    </div>
  );
}
