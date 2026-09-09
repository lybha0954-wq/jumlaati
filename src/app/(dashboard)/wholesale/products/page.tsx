import { Topbar } from "@/components/dashboard/Topbar";
import { ProductForm } from "@/components/forms/ProductForm";
import { wholesaleService } from "@/lib/services/wholesaleService";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/currency";

export default async function WholesaleProductsPage() {
  // جلب منتجات التاجر الحقيقي من قاعدة البيانات
  const products = await wholesaleService.getMyProducts();

  const columns = [
    { key: "name", header: "المنتج" },
    { key: "category", header: "الفئة" },
    { key: "price", header: "السعر", render: (row: any) => `${formatCurrency(row.price)}` },
    { key: "stock", header: "الكمية", render: (row: any) => (
        row.stock < 10 ? <Badge variant="destructive">مخزون منخفض ({row.stock})</Badge> : <Badge>{row.stock}</Badge>
    )},
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <div className="flex gap-2">
            <Button size="sm" variant="outline">تعديل</Button>
            <Button size="sm" variant="destructive">حذف</Button>
        </div>
    )},
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">إدارة منتجات الجملة</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">إضافة منتج</h2>
          <ProductForm />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">قائمة المنتجات</h2>
          {products.length === 0 ? (
            <p className="text-center text-gray-500 py-10">لم تقم بإضافة أي منتجات بعد.</p>
          ) : (
            <DataTable data={products} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
