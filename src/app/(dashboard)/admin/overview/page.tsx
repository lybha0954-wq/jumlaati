import { Topbar } from "@/components/dashboard/Topbar";
import { StatsCard } from "@/components/shared/StatsCard";
import { BarChart } from "@/components/charts/BarChart";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // جلب الإحصائيات الحقيقية من قاعدة البيانات
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const { data: allOrders } = await supabase.from('orders').select('total');
  
  const totalRevenue = allOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

  // بيانات تجريبية للرسم البياني (سيتم ربطها لاحقاً بشكل ديناميكي)
  const chartData = [
    { name: "يناير", value: totalRevenue * 0.2 },
    { name: "فبراير", value: totalRevenue * 0.3 },
    { name: "مارس", value: totalRevenue * 0.5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">نظرة عامة للمنصة</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="إجمالي المستخدمين" value={totalUsers?.toString() || "0"} icon={<Users size={24} />} />
          <StatsCard title="إجمالي الطلبات" value={totalOrders?.toString() || "0"} icon={<ShoppingCart size={24} />} />
          <StatsCard title="إجمالي الإيرادات" value={formatCurrency(totalRevenue)} icon={<DollarSign size={24} />} />
          <StatsCard title="نمو الأرباح" value="+12%" icon={<TrendingUp size={24} />} trend="+12%" trendUp={true} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">الإيرادات الشهرية</h2>
          <BarChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
