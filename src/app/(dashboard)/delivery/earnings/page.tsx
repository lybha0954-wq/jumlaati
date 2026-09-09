import { Topbar } from "@/components/dashboard/Topbar";
import { StatsCard } from "@/components/shared/StatsCard";
import { formatCurrency } from "@/lib/utils/currency";

export default function DeliveryEarningsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">أرباحي</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard title="أرباح هذا الشهر" value={formatCurrency(150000)} icon="💵" />
          <StatsCard title="إجمالي الأرباح" value={formatCurrency(450000)} icon="💰" trend="+10%" trendUp={true} />
        </div>
      </div>
    </div>
  );
}
