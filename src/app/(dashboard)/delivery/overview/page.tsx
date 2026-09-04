import { Topbar } from "@/components/dashboard/Topbar";
import { StatsCard } from "@/components/shared/StatsCard";
import { formatCurrency } from "@/lib/utils/currency";

export default async function DeliveryOverviewPage() {
  // بيانات تجريبية مؤقتة حتى يتم ربطها كاملة، لكن البنية تعمل
  const pendingTasks = 12;
  const deliveredTasks = 58;
  const earningsToday = 25000;

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">نظرة عامة للمندوب</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="طلبات قيد الانتظار" value={pendingTasks.toString()} icon="⏳" />
          <StatsCard title="طلبات تم تسليمها" value={deliveredTasks.toString()} icon="✅" trend="+5%" trendUp={true} />
          <StatsCard title="أرباح اليوم (د.ع)" value={formatCurrency(earningsToday)} icon="💰" />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-center py-10">سيتم عرض تفاصيل المهام والأرباح التفصيلية هنا.</p>
        </div>
      </div>
    </div>
  );
}
