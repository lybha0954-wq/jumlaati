import { AnalyticsStats } from "../components/AdminStats";
import { BarChart } from "@/components/charts/BarChart";
import { Topbar } from "@/components/dashboard/Topbar";

export default function AdminAnalyticsPage() {
  const data = [
    { name: "يناير", value: 1000 },
    { name: "فبراير", value: 1500 },
    { name: "مارس", value: 1200 },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">تحليلات المنصة</h1>
      
      {/* استخدام المكون الجديد المنفصل */}
      <AnalyticsStats />

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">المبيعات الشهرية</h2>
        <BarChart data={data} />
      </div>
    </div>
  );
}
