import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNavBar } from "@/components/shared/BottomNavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 pb-16 md:pb-0">{children}</div>
      <BottomNavBar />
    </div>
  );
}
