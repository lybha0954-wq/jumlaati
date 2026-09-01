import { Topbar } from "@/components/shared/Topbar";

export default function DeliveryTaskHistoryPage() {
  const history = [
    { id: 1, address: "بغداد - الكرادة", date: "2026-08-01", status: "مكتمل" },
    { id: 2, address: "أربيل - عنكاوا", date: "2026-08-03", status: "مكتمل" },
    { id: 3, address: "البصرة - العشار", date: "2026-08-07", status: "ملغي" },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">سجل المهام</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-right font-medium text-gray-600">رقم المهمة</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">العنوان</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">التاريخ</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {history?.map((task) => (
              <tr key={task?.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">#{task?.id}</td>
                <td className="px-4 py-3">{task?.address}</td>
                <td className="px-4 py-3">{task?.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${task?.status === "مكتمل" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {task?.status}
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
