import { Topbar } from "@/components/dashboard/Topbar";
import { RequestCard } from "@/components/shared/RequestCard";
import { productService } from "@/lib/services/productService";
import { Package, Search } from "lucide-react";

export default async function ProductsPage() {
  // جلب جميع المنتجات النشطة
  let products: any[] = [];
  try {
    products = await productService.getAllProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">جميع المنتجات</h1>
        
        {/* شريط بحث بسيط */}
        <div className="relative mb-8">
          <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="ابحث عن منتج..." className="w-full h-12 rounded-xl border border-gray-200 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        {products.length === 0 ? (
          <div className="bg-white p-10 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl">
            <Package className="mx-auto mb-4 text-gray-300" size={48} />
            لا توجد منتجات متاحة حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <RequestCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
