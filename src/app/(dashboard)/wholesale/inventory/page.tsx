"use client";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";

export default function WholesaleInventoryPage() {
  const products = [
    { name: "أرز بسمتي", category: "أغذية", stock: 5, price: 12000 },
    { name: "زيت نباتي", category: "أغذية", stock: 30, price: 8000 },
    { name: "سكر أبيض", category: "أغذية", stock: 2, price: 5000 },
  ];

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
        <DataTable data={products} columns={columns} />
      </div>
    </div>
  );
}
