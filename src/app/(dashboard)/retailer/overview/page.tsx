import { Topbar } from "@/components/dashboard/Topbar";
import { StatsCard } from "@/components/shared/StatsCard";

export default function RetailerOverviewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">نظرة عامة للتاجر</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="إجمالي المبيعات" value="250,000 د.ع" icon="💵" />
          <StatsCard title="طلبات قيد الانتظار" value="3" icon="📦" />
          <StatsCard title="نقاط الولاء" value="150 نقطة" icon="⭐" />
        </div>
      </div>
    </div>
  );
}
