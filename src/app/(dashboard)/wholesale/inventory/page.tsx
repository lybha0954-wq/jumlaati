"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export default function WholesaleInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) setProducts(await res.json());
    } catch (error) {
      showToast("خطأ في جلب المنتجات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const columns = [
    { key: "name", header: "المنتج" },
    { key: "category", header: "الفئة" },
    { key: "stock", header: "الكمية", render: (row: any) => (
        row.stock < 10 ? <Badge variant="destructive">منخفض ({row.stock})</Badge> : <Badge>متوفر ({row.stock})</Badge>
    )},
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <Button size="sm" variant="outline">تعديل المخزون</Button>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">إدارة المخزون</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {products.length === 0 ? (
            <div className="py-10 text-center text-gray-500">لا توجد منتجات في المخزون بعد.</div>
          ) : (
            <DataTable data={products} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
