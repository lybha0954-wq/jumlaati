import { Topbar } from "@/components/dashboard/Topbar";
import { WholesaleStats } from "@/components/shared/StatsCard";
import { LineChart } from "@/components/charts/LineChart";
import { wholesalesService } from "@/lib/services/wholesaleService";
import { formatCurrency } from "@/lib/utils/currency";
import { Button } from "@/components/ui/Button";

export default async function WholesaleOverviewPage() {
  let products = [];
  let orders = [];
  let totalRevenue = 0;
  
  try {
    const userProducts = await wholesalesService.getMyProducts();
    products = userProducts || [];
    
    // جلب الطلبات المرتبطة بهذا التاجر (سنضيف هذه الدالة في الخدمة لاحقاً لكن هنا نستخدم الحالية)
    // ملاحظة: يجب أن تكون دالة getMyWholesaleOrders موجودة في الخدمة
    const wholesaleOrders = await wholesalesService.getMyOrders?.() || [];
    orders = wholesaleOrders;
    totalRevenue = orders.reduce((sum, order) => sum + (order?.total || 0), 0);
  } catch (error) {
    console.error("Error fetching wholesale data:", error);
  }

  const chartData = orders.slice(0, 7).map((order, index) => ({
    name: `طلب #${index + 1}`,
    value: order.total
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">نظرة عامة للجملة</h1>
          <Button variant="outline" size="sm">تصدير التقرير</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <WholesaleStats title="إجمالي الإيرادات" value={formatCurrency(totalRevenue)} icon="💰" trend="+12%" trendUp={true} />
          <WholesaleStats title="عدد الطلبات" value={orders.length.toString()} icon="📦" trend="+5%" trendUp={true} />
          <WholesaleStats title="المنتجات النشطة" value={products.length.toString()} icon="🛍️" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">اتجاه الإيرادات</h2>
            {chartData.length > 0 ? (
              <LineChart data={chartData} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">لا توجد بيانات للإيرادات بعد</div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">أحدث الطلبات</h2>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium text-gray-800">طلب #{order.id.slice(0, 6)}</p>
                      <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('ar-IQ')}</p>
                    </div>
                    <span className="font-bold text-primary">{formatCurrency(order.total)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-gray-400">لا توجد طلبات واردة بعد</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
