import { retailerService } from "@/lib/services/retailerService";
import { BarChart } from "@/components/charts/BarChart";
import { StatsCard } from "../../../../components/shared/StatsCard";

export default async function RetailerOverviewPage() {
  let orders: any[] = [];
  try {
    orders = await retailerService.getMyOrders();
  } catch {
    orders = [];
  }

  const totalSales = orders?.reduce((sum, order) => sum + (order?.total ?? 0), 0);
  const pendingOrders = orders?.filter(o => o?.status === "pending")?.length ?? 0;
  const deliveredOrders = orders?.filter(o => o?.status === "delivered")?.length ?? 0;

  const chartData = orders?.slice(0, 4)?.map((order, index) => ({
    name: `طلب #${index + 1}`,
    value: order?.total
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">نظرة عامة للتاجر</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard title="إجمالي المبيعات" value={`${totalSales?.toLocaleString()} د.ع`} icon="💰" trend="+12%" trendUp={true} />
        <StatsCard title="طلبات قيد الانتظار" value={pendingOrders?.toString()} icon="⏳" trend="" trendUp={false} />
        <StatsCard title="طلبات مكتملة" value={deliveredOrders?.toString()} icon="✅" trend="" trendUp={false} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">قيمة الطلبات الأخيرة</h2>
          {chartData?.length > 0 ? (
             <BarChart data={chartData} />
          ) : (
             <p className="text-gray-500">لا توجد طلبات بعد.</p>
          )}
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">آخر نشاط</h2>
          <ul className="space-y-3">
            {orders?.slice(0, 5)?.map((order) => (
              <li key={order?.id} className="flex justify-between border-b pb-2">
                 <span className="font-medium">طلب #{order?.id}</span>
                 <span className="text-primary font-bold">{order?.total?.toLocaleString()} د.ع</span>
              </li>
            ))}
            {orders?.length === 0 && <li className="text-gray-500">لا يوجد نشاط بعد.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
