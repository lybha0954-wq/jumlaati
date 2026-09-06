import { Topbar } from "@/components/dashboard/Topbar";
import { StatsCard } from "@/components/shared/StatsCard";

export default function AdminOverviewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">نظرة عامة للمنصة</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="إجمالي المستخدمين" value="10" icon="👥" />
          <StatsCard title="إجمالي الطلبات" value="25" icon="📦" />
          <StatsCard title="الإيرادات" value="1,200,000 د.ع" icon="💰" />
          <StatsCard title="نمو الأرباح" value="+15%" icon="📈" trend="+15%" trendUp={true} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-center text-gray-500">مرحباً بك في لوحة تحكم جُمْلَتِي (وضع المعاينة)</p>
        </div>
      </div>
    </div>
  );
}
