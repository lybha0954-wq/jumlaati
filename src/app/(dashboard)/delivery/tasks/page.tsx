import { Topbar } from "@/components/shared/Topbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function DeliveryTasksPage() {
  const tasks = [
    { id: 1, address: "بغداد - الكرادة", status: "pending" },
    { id: 2, address: "أربيل - عنكاوا", status: "delivered" },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">مهام التوصيل</h1>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
            <div>
              <p className="font-semibold">طلب #{task.id}</p>
              <p className="text-sm text-gray-500">{task.address}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={task.status === "delivered" ? "default" : "secondary"}>
                {task.status === "delivered" ? "تم التوصيل" : "قيد الانتظار"}
              </Badge>
              {task.status !== "delivered" && (
                <Button size="sm" variant="outline">بدء التسليم</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
