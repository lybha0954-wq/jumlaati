export const dynamic = "force-dynamic";

import { Topbar } from "@/components/dashboard/Topbar";
import { RequestCard } from "@/components/shared/RequestCard";
import { productService } from "@/lib/services/productService";
import { ProductsSearchBar } from "./ProductsSearchBar";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  let products: any[] = [];
  try {
    products = await productService.getAllProducts();
    if (query) {
      const lower = query.toLowerCase();
      products = products.filter(
        (p: any) =>
          p.name?.toLowerCase().includes(lower) ||
          p.category?.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower)
      );
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">
          {query ? `نتائج البحث عن: ${query}` : "كل المنتجات"}
        </h1>
        <ProductsSearchBar initialQuery={query} />

        {products.length === 0 ? (
          <div className="bg-white p-10 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl">
            {query
              ? `لا توجد منتجات تطابق "${query}".`
              : "لا توجد منتجات بعد."}
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
