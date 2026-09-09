import { Topbar } from "@/components/shared/Topbar";

export default function AdminOverviewPage() {
  const stats = [
    { label: "إجمالي المستخدمين", value: "1,240" },
    { label: "الطلبات النشطة", value: "87" },
    { label: "إجمالي الإيرادات", value: "4,500,000 د.ع" },
    { label: "النزاعات المفتوحة", value: "12" },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">نظرة عامة</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((stat) => (
          <div key={stat?.label} className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-primary">{stat?.value}</p>
            <p className="text-gray-500 mt-2 text-sm">{stat?.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
