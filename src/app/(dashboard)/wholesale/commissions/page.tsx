import { Topbar } from "@/components/dashboard/Topbar";
import { formatCurrency } from "@/lib/utils/currency";

export default function WholesaleCommissionsPage() {
  const commissions = [
    { id: "C1", order: "ORD-201", amount: 15000, date: "2026-08-01", status: "مدفوعة" },
    { id: "C2", order: "ORD-202", amount: 22000, date: "2026-08-06", status: "معلقة" },
    { id: "C3", order: "ORD-203", amount: 18000, date: "2026-08-12", status: "مدفوعة" },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">العمولات</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-right font-medium text-gray-600">رقم الطلب</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">المبلغ</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">التاريخ</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {commissions?.map((c) => (
              <tr key={c?.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{c?.order}</td>
                <td className="px-4 py-3">{formatCurrency(c?.amount)}</td>
                <td className="px-4 py-3">{c?.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${c?.status === "مدفوعة" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {c?.status}
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
