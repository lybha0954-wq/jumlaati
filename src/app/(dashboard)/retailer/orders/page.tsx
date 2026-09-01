import { retailerService } from "@/lib/services/retailerService";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default async function RetailerOrdersPage() {
  // جلب الطلبات الحقيقية
  const orders = await retailerService.getMyOrders();

  const columns = [
    { key: "id", header: "رقم الطلب" },
    { key: "created_at", header: "التاريخ" },
    { key: "total", header: "المجموع", render: (row: any) => `${row.total.toLocaleString()} د.ع` },
    { key: "status", header: "الحالة", render: (row: any) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">طلباتي</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        {orders.length > 0 ? (
          <DataTable data={orders} columns={columns} />
        ) : (
          <p className="text-center text-gray-500 py-10">لا توجد طلبات حالياً. قم بتصفح المتجر وأضف منتجات!</p>
        )}
      </div>
    </div>
  );
}
