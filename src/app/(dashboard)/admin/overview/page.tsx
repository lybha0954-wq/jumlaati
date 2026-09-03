import { Topbar } from "@/components/dashboard/Topbar";
import { AdminStats } from "../components/AdminStats";

export default function AdminOverviewPage() {
  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">نظرة عامة</h1>
      
      {/* استخدام المكون المشترك بدلاً من تكرار الكود */}
      <AdminStats />
    </div>
  );
}
