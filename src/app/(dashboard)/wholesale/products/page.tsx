"use client";
import { ProductForm } from "@/components/forms/ProductForm";
import { Topbar } from "@/components/dashboard/Topbar";

import { Input } from "@/components/ui/Input";

export default function WholesaleProductsPage() {
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
          <Input placeholder="بحث في المنتجات..." className="mb-4" />
          <p>سيتم عرض قائمة المنتجات هنا.</p>
        </div>
      </div>
    </div>
  );
}
