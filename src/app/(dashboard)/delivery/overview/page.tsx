import { Topbar } from "@/components/dashboard/Topbar";
import { StatsCard } from "@/components/shared/StatsCard";

export default function DeliveryOverviewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">نظرة عامة للمندوب</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="مهام قيد الانتظار" value="4" icon="🚚" />
          <StatsCard title="مهام مكتملة" value="12" icon="✅" />
          <StatsCard title="أرباح اليوم" value="50,000 د.ع" icon="💰" />
        </div>
      </div>
    </div>
  );
}
