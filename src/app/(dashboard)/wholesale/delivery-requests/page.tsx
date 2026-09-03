import { Topbar } from "@/components/dashboard/Topbar";

export default function WholesaleDeliveryRequestsPage() {
  const requests = [
    { id: "DR-1", retailer: "متجر الأمل", address: "بغداد - الكرادة", status: "قيد الانتظار" },
    { id: "DR-2", retailer: "متجر السلام", address: "أربيل - عنكاوا", status: "جارٍ التوصيل" },
    { id: "DR-3", retailer: "متجر النور", address: "البصرة - العشار", status: "مكتمل" },
  ];

  const statusColor: Record<string, string> = {
    "قيد الانتظار": "bg-yellow-100 text-yellow-700",
    "جارٍ التوصيل": "bg-blue-100 text-blue-700",
    "مكتمل": "bg-green-100 text-green-700",
  };

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">طلبات التوصيل</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-right font-medium text-gray-600">رقم الطلب</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">التاجر</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">العنوان</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{r.id}</td>
                <td className="px-4 py-3">{r.retailer}</td>
                <td className="px-4 py-3">{r.address}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[r.status] ?? "bg-gray-100 text-gray-700"}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
