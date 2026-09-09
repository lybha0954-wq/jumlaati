import { AreaChart } from "@/components/charts/AreaChart";
import { PieChart } from "@/components/charts/PieChart";
import { Topbar } from "@/components/shared/Topbar";

export default function AdminAnalyticsPage() {
  const salesData = [
    { name: "يناير", value: 1000 },
    { name: "فبراير", value: 1500 },
    { name: "مارس", value: 1200 },
    { name: "أبريل", value: 1800 },
  ];

  const categoryData = [
    { name: "إلكترونيات", value: 400 },
    { name: "ملابس", value: 300 },
    { name: "أغذية", value: 300 },
    { name: "أخرى", value: 200 },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">تحليلات المنصة</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">المبيعات الشهرية</h2>
          <AreaChart data={salesData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">توزيع المبيعات حسب الفئة</h2>
          <PieChart data={categoryData} />
        </div>
      </div>
    </div>
  );
}
