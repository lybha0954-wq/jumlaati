import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function DeliveryOverviewPage() {
  const tasks = [
    { id: 1, address: "بغداد - المنصور", status: "pending" },
    { id: 2, address: "بغداد - زيونة", status: "delivered" },
    { id: 3, address: "أربيل - شارع 60", status: "pending" },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">نظرة عامة لمندوب التوصيل</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-4xl font-bold text-primary">{tasks?.filter(t => t?.status === 'pending')?.length}</h3>
          <p className="text-gray-500 mt-2">طلبات قيد الانتظار</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-4xl font-bold text-green-600">{tasks?.filter(t => t?.status === 'delivered')?.length}</h3>
          <p className="text-gray-500 mt-2">طلبات تم تسليمها</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-4xl font-bold text-yellow-600">25,000</h3>
          <p className="text-gray-500 mt-2">أرباح اليوم (د.ع)</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">أحدث المهام</h2>
        <div className="space-y-3">
          {tasks?.map(task => (
            <div key={task?.id} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">طلب #{task?.id}</p>
                <p className="text-sm text-gray-500">{task?.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={task?.status === 'pending' ? 'secondary' : 'default'}>{task?.status === 'pending' ? 'جديد' : 'مكتمل'}</Badge>
                <Button size="sm" variant="outline">التفاصيل</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
