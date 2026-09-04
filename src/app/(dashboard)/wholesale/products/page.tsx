"use client";
import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProductForm } from "@/components/forms/ProductForm";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function WholesaleProductsPage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { showToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) setProducts(await res.json());
    } catch (error) {
      showToast("خطأ في جلب المنتجات", "error");
    }
  }, [showToast]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("تم حذف المنتج", "success"); fetchProducts(); } else { showToast("خطأ في الحذف", "error"); }
  };

  const columns = [
    { key: "name", header: "المنتج" },
    { key: "category", header: "الفئة" },
    { key: "price", header: "السعر", render: (row: any) => formatCurrency(row.price) },
    { key: "stock", header: "الكمية", render: (row: any) => (row.stock < 10 ? <Badge variant="destructive">منخفض ({row.stock})</Badge> : <Badge>{row.stock}</Badge>) },
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => { setEditingProduct(row); setShowForm(true); }}><Pencil size={14} /></Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(row.id)}><Trash2 size={14} /></Button>
        </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">إدارة منتجات الجملة</h1>
          <Button onClick={() => { setEditingProduct(null); setShowForm(true); }}><Plus size={18} className="ml-2" /> إضافة منتج</Button>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {products.length === 0 ? (
            <p className="text-center text-gray-500 py-10">لم تقم بإضافة أي منتجات بعد. اضغط على زر إضافة منتج للبدء.</p>
          ) : (
            <DataTable data={products} columns={columns} />
          )}
        </div>
      </div>
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}>
        <ProductForm initialData={editingProduct} onSuccess={() => { setShowForm(false); fetchProducts(); }} />
      </Modal>
    </div>
  );
}
