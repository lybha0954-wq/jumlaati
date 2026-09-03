import { Topbar } from "@/components/dashboard/Topbar";
import { formatCurrency } from "@/lib/utils/currency";

export default function WholesalePayoutsPage() {
  const payouts = [
    { id: "PAY-1", date: "2026-08-01", amount: 250000, status: "مدفوع" },
    { id: "PAY-2", date: "2026-08-15", amount: 180000, status: "معلق" },
    { id: "PAY-3", date: "2026-09-01", amount: 320000, status: "مدفوع" },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">المدفوعات والمستحقات</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-right font-medium text-gray-600">رقم الدفعة</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">التاريخ</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">المبلغ</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {payouts?.map((p) => (
              <tr key={p?.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{p?.id}</td>
                <td className="px-4 py-3">{p?.date}</td>
                <td className="px-4 py-3">{formatCurrency(p?.amount)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p?.status === "مدفوع" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {p?.status}
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
