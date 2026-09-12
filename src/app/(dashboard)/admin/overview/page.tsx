import { Topbar } from "@/components/dashboard/Topbar";
import { StatsCard } from "@/components/shared/StatsCard";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // جلب كل الإحصائيات بالتوازي
  const [
    { count: usersCount },
    { count: ordersCount },
    { data: paidPayments },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("payments").select("amount").eq("status", "completed"),
  ]);

  const totalRevenue = (paidPayments || []).reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">نظرة عامة للمنصة</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="إجمالي المستخدمين"
            value={String(usersCount || 0)}
            icon={<Users className="text-blue-500" />}
          />
          <StatsCard
            title="إجمالي الطلبات"
            value={String(ordersCount || 0)}
            icon={<ShoppingCart className="text-orange-500" />}
          />
          <StatsCard
            title="الإيرادات"
            value={formatCurrency(totalRevenue)}
            icon={<DollarSign className="text-green-500" />}
          />
          <StatsCard
            title="نمو الأرباح"
            value="15%+"
            icon={<TrendingUp className="text-emerald-500" />}
            trend="+15%"
            trendUp={true}
          />
        </div>

        <div className="mt-6 p-6 bg-white rounded-2xl shadow-sm">
          <p className="text-center text-gray-600">
            مرحباً بك في لوحة تحكم الإدارة.
          </p>
        </div>
      </div>
    </div>
  );
}
