import { BarChart } from "@/components/charts/BarChart";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";

export default function RetailerOverviewPage() {
  const dummyData = [
    { name: "الأسبوع 1", value: 400 },
    { name: "الأسبوع 2", value: 300 },
    { name: "الأسبوع 3", value: 550 },
    { name: "الأسبوع 4", value: 490 },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">نظرة عامة للتاجر</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">المبيعات الأسبوعية</h2>
          <BarChart data={dummyData} />
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">إحصائيات سريعة</h2>
          <div className="space-y-4">
            <div className="flex justify-between"><span>إجمالي الطلبات:</span><strong>1,240</strong></div>
            <div className="flex justify-between"><span>العملاء:</span><strong>85</strong></div>
            <div className="flex justify-between"><span>العمولات:</span><strong>450,000 د.ع</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
