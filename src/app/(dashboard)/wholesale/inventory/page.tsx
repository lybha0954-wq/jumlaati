import { wholesaleService } from "@/lib/services/wholesaleService";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";

export default async function WholesaleInventoryPage() {
  // جلب منتجات تاجر الجملة الحقيقي
  const products = await wholesaleService.getMyProducts();

  const columns = [
    { key: "name", header: "المنتج" },
    { key: "category", header: "الفئة" },
    { key: "stock", header: "الكمية", render: (row: any) => (
        row.stock < 10 ? <Badge variant="destructive">مخزون منخفض ({row.stock})</Badge> : <Badge>متوفر ({row.stock})</Badge>
    )},
    { key: "price", header: "السعر", render: (row: any) => `${row.price.toLocaleString()} د.ع` },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">إدارة المخزون</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        {products.length > 0 ? (
          <DataTable data={products} columns={columns} />
        ) : (
          <p className="text-center text-gray-500 py-10">لم تقم بإضافة أي منتجات بعد.</p>
        )}
      </div>
    </div>
  );
}
