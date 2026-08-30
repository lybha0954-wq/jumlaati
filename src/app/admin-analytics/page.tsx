import AdminAnalyticsContent from './components/AdminAnalyticsContent';

export default function Page() {
  return <AdminAnalyticsContent />;
}
// app/admin-analytics/page.tsx
import { analyticsService } from '@/lib/services/analyticsService';
import SalesChart from './components/SalesChart';
import TopProductsChart from './components/TopProductsChart';
import DeliveryPerformanceChart from './components/DeliveryPerformanceChart';
import QuickStatsCards from './components/QuickStatsCards';

export default async function AdminAnalyticsPage() {
  // جلب جميع البيانات بالتوازي (لأقصى سرعة)
  const [salesData, topProducts, deliveryPerformance, quickStats] = await Promise.all([
    analyticsService.getSalesOverview(30),
    analyticsService.getTopProducts(10),
    analyticsService.getDeliveryPerformance(),
    analyticsService.getQuickStats(),
  ]);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold">📊 لوحة التحليلات</h1>

      {/* البطاقات العلوية */}
      <QuickStatsCards stats={quickStats} />

      {/* الرسم البياني للمبيعات */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">📈 المبيعات اليومية (آخر 30 يوماً)</h2>
        <SalesChart data={salesData} />
      </div>

      {/* صف مزدوج: المنتجات الأكثر مبيعاً + أداء المندوبين */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">🏆 أكثر المنتجات مبيعاً</h2>
          <TopProductsChart data={topProducts} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">🛵 أداء مندوبي التوصيل</h2>
          <DeliveryPerformanceChart data={deliveryPerformance} />
        </div>
      </div>
    </div>
  );
}
