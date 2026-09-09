import { Topbar } from "@/components/dashboard/Topbar";
import { WholesaleStats } from "@/app/(dashboard)/wholesale/components/WholesaleStats";
import { LineChart } from "@/components/charts/LineChart";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/currency";

export default function WholesaleOverviewPage() {
  const salesData = [
    { name: "يناير", value: 5000 },
    { name: "فبراير", value: 7000 },
    { name: "مارس", value: 6000 },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">نظرة عامة للجملة</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <WholesaleStats title="إجمالي الإيرادات" value={formatCurrency(18000000)} icon="💰" trend="+12%" trendUp={true} />
        <WholesaleStats title="الطلبات النشطة" value="120" icon="📦" trend="+5%" trendUp={true} />
        <WholesaleStats title="المخزون المنخفض" value="5" icon="⚠️" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">اتجاه المبيعات</h2>
          <LineChart data={salesData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold mb-4">إجراءات سريعة</h2>
          <Button className="w-full">إضافة منتج جديد</Button>
          <Button variant="outline" className="w-full">إدارة المخزون</Button>
        </div>
      </div>
    </div>
  );
}
