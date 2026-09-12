"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BarChart } from "@/components/charts/BarChart";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Users, ShoppingCart, DollarSign } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, usersCount: 0 });
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          const json = await res.json();
          setData(json.chartData || []);
          setStats(json.stats || stats);
        } else {
          showToast("فشل تحميل التحليلات", "error");
        }
      } catch {
        showToast("خطأ في الاتصال", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [showToast]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">التحليلات</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-500">الإيرادات</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-500">الطلبات</CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-500">المستخدمون</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.usersCount}</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">الإيرادات الشهرية</h2>
          {data.length > 0 ? (
            <BarChart data={data} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              لا توجد بيانات كافية للعرض
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
