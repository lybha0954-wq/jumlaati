import { Topbar } from "@/components/dashboard/Topbar";
import { AdminStats } from "@/app/(dashboard)/admin/components/AdminStats";

export default function AdminOverviewPage() {
  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">نظرة عامة</h1>
      <AdminStats />
    </div>
  );
}
