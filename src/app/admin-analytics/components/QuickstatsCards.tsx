'use client';

interface QuickStatsCardsProps {
  stats: { totalRevenue: number; totalOrders: number; avgOrderValue: number };
}

export default function QuickStatsCards({ stats }: QuickStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
        <p className="text-sm opacity-90">إجمالي الإيرادات</p>
        <p className="text-3xl font-bold">{stats.totalRevenue.toFixed(2)} ريال</p>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
        <p className="text-sm opacity-90">إجمالي الطلبات</p>
        <p className="text-3xl font-bold">{stats.totalOrders}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
        <p className="text-sm opacity-90">متوسط قيمة الطلب</p>
        <p className="text-3xl font-bold">{stats.avgOrderValue.toFixed(2)} ريال</p>
      </div>
    </div>
  );
}
