import { Topbar } from "@/components/dashboard/Topbar";
import { StatsCard } from "@/components/shared/StatsCard";

export default function WholesaleOverviewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">نظرة عامة للجملة</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="إجمالي الإيرادات" value="800,000 د.ع" icon="💰" />
          <StatsCard title="المنتجات النشطة" value="12" icon="🛍️" />
          <StatsCard title="طلبات قيد الانتظار" value="5" icon="⏳" />
        </div>
      </div>
    </div>
  );
}
