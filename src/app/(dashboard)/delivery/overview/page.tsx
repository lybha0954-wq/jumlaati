export const dynamic = "force-dynamic";

import { Topbar } from "@/components/dashboard/Topbar";
import { StatsCard } from "@/components/shared/StatsCard";
import { deliveryService } from "@/lib/services/deliveryService";

export default async function DeliveryOverviewPage() {
  let tasks: any[] = [];
  try {
    tasks = await deliveryService.getMyTasks() || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">نظرة عامة للمندوب</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="مهام قيد الانتظار" value={tasks.length.toString()} icon="🚚" />
          <StatsCard title="مهام مكتملة" value="0" icon="✅" />
          <StatsCard title="أرباح اليوم" value="0 د.ع" icon="💰" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">أحدث المهام</h2>
          <div className="py-10 text-center text-gray-400">لا توجد مهام حالياً.</div>
        </div>
      </div>
    </div>
  );
}
