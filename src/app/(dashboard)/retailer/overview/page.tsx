export const dynamic = "force-dynamic";

import { Topbar } from "@/components/dashboard/Topbar";
import { StatsCard } from "@/components/shared/StatsCard";
import { retailerService } from "@/lib/services/retailerService";
import { formatCurrency } from "@/lib/utils/currency";

export default async function RetailerOverviewPage() {
  let orders: any[] = [];
  try {
    orders = await retailerService.getMyOrders() || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  const totalSales = orders.reduce((sum, order) => sum + (order?.total || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">نظرة عامة للتاجر</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="إجمالي المبيعات" value={formatCurrency(totalSales)} icon="💰" />
          <StatsCard title="طلبات قيد الانتظار" value={orders.filter(o => o.status === "pending").length.toString()} icon="⏳" />
          <StatsCard title="طلبات مكتملة" value={orders.filter(o => o.status === "delivered").length.toString()} icon="✅" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">آخر الطلبات</h2>
          {orders.length === 0 ? (
            <p className="text-center text-gray-400 py-10">لا توجد طلبات بعد.</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center border-b pb-3">
                  <p className="font-medium">طلب #{order.id.slice(0, 6)}</p>
                  <span className="font-bold text-primary">{formatCurrency(order.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
