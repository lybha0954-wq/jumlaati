import { Card } from "@/components/ui/Card";

export function AdminStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-gray-500 text-sm">إجمالي المبيعات</h3>
        <p className="text-3xl font-extrabold text-primary mt-2">150,000 د.ع</p>
      </Card>
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-gray-500 text-sm">عدد الطلبات</h3>
        <p className="text-3xl font-extrabold text-green-600 mt-2">1,240</p>
      </Card>
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-gray-500 text-sm">العملاء النشطون</h3>
        <p className="text-3xl font-extrabold text-blue-600 mt-2">85</p>
      </Card>
    </div>
  );
}
