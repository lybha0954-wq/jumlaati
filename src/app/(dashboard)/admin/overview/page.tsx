export const dynamic = "force-dynamic";

import { Topbar } from "@/components/dashboard/Topbar";
import { StatsCard } from "@/components/shared/StatsCard";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const { data: allOrders } = await supabase.from('orders').select('total');
  const totalRevenue = allOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">نظرة عامة للمنصة</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="إجمالي المستخدمين" value={totalUsers?.toString() || "0"} icon="👥" />
          <StatsCard title="إجمالي الطلبات" value={totalOrders?.toString() || "0"} icon="📦" />
          <StatsCard title="الإيرادات" value={formatCurrency(totalRevenue)} icon="💰" />
          <StatsCard title="نمو الأرباح" value="+15%" icon="📈" trend="+15%" trendUp={true} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-center text-gray-500">مرحباً بك في لوحة تحكم الإدارة.</p>
        </div>
      </div>
    </div>
  );
}
