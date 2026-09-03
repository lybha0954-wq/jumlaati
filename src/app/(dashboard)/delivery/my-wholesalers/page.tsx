"use client";
import { Topbar } from "@/components/dashboard/Topbar";
import { Badge } from "@/components/ui/Badge";

export default function MyWholesalersPage() {
  const wholesalers = [
    { id: 1, name: "شركة النور", area: "بغداد - الكرادة", status: "نشط" },
    { id: 2, name: "مؤسسة الخير", area: "أربيل", status: "نشط" },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">تجار الجملة المرتبطون بي</h1>
      <div className="space-y-4">
        {wholesalers.map((w) => (
          <div key={w.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold">{w.name}</h3>
              <p className="text-sm text-gray-500">{w.area}</p>
            </div>
            <Badge variant="success">{w.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
