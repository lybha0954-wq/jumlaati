export const dynamic = "force-dynamic";

import { Topbar } from "@/components/dashboard/Topbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductCard } from "@/components/shared/ProductCard";
import { productService } from "@/lib/services/productService";
import { ProductsSearchBar } from "./ProductsSearchBar";
import { Package, Search } from "lucide-react";
import Link from "next/link";

type SortKey = "newest" | "price_low" | "price_high" | "name";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest",     label: "الأحدث" },
  { key: "price_low",  label: "الأرخص" },
  { key: "price_high", label: "الأغلى" },
  { key: "name",       label: "الاسم" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; sort?: string; avail?: string }>;
}) {
  const sp = await searchParams;
  const query = (sp.q || "").trim();
  const catFilter = sp.cat || "";
  const sort = (sp.sort || "newest") as SortKey;
  const availOnly = sp.avail === "1";

  let products: any[] = [];
  try {
    products = await productService.getAllProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  // إحصاء التصنيفات قبل الفلترة
  const allCats = Array.from(
    new Set(
      products.map((p: any) => p.category).filter(Boolean)
    )
  ).sort() as string[];

  // فلترة
  let filtered = products;
  if (query) {
    const lower = query.toLowerCase();
    filtered = filtered.filter(
      (p: any) =>
        p.name?.toLowerCase().includes(lower) ||
        p.category?.toLowerCase().includes(lower) ||
        p.description?.toLowerCase().includes(lower)
    );
  }
  if (catFilter) {
    filtered = filtered.filter((p: any) => p.category === catFilter);
  }
  if (availOnly) {
    filtered = filtered.filter((p: any) => Number(p.stock_quantity ?? 0) > 0);
  }

  // ترتيب
  filtered = [...filtered].sort((a: any, b: any) => {
    if (sort === "price_low") return Number(a.price || 0) - Number(b.price || 0);
    if (sort === "price_high") return Number(b.price || 0) - Number(a.price || 0);
    if (sort === "name") return String(a.name).localeCompare(String(b.name), "ar");
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  // بناء روابط الفلاتر مع الحفاظ على الباقي
  const buildUrl = (updates: Record<string, string | null>) => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (catFilter && !("cat" in updates)) p.set("cat", catFilter);
    if (sort && sort !== "newest" && !("sort" in updates)) p.set("sort", sort);
    if (availOnly && !("avail" in updates)) p.set("avail", "1");
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null) p.delete(k);
      else p.set(k, v);
    });
    const str = p.toString();
    return `/products${str ? "?" + str : ""}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Topbar />
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* رأس */}
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">
            {query ? `نتائج البحث عن "${query}"` : "كل المنتجات"}
          </h1>
          <p className="text-sm text-gray-500">
            {filtered.length} منتج متاح
          </p>
        </div>

        {/* بحث */}
        <div className="mb-4">
          <ProductsSearchBar initialQuery={query} />
        </div>

        {/* فلاتر التصنيف */}
        {allCats.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            <Link href={buildUrl({ cat: null })}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                !catFilter
                  ? "bg-[#2e8b73] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
              }`}>
              الكل
            </Link>
            {allCats.map((c) => (
              <Link key={c} href={buildUrl({ cat: c })}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  catFilter === c
                    ? "bg-[#2e8b73] text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
                }`}>
                {c}
              </Link>
            ))}
          </div>
        )}

        {/* فلتر الترتيب + التوفر */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500">ترتيب:</span>
          {SORT_OPTIONS.map((o) => (
            <Link key={o.key} href={buildUrl({ sort: o.key })}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all ${
                sort === o.key
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}>
              {o.label}
            </Link>
          ))}

          <div className="flex-1" />

          <Link href={buildUrl({ avail: availOnly ? null : "1" })}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all ${
              availOnly
                ? "bg-[#2e8b73] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}>
            {availOnly ? "✓ " : ""}المتوفر فقط
          </Link>

          {(query || catFilter || sort !== "newest" || availOnly) && (
            <Link href="/products"
              className="rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-100">
              مسح الكل
            </Link>
          )}
        </div>

        {/* المحتوى */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={query ? Search : Package}
            title={query ? `لا نتائج لـ "${query}"` : "لا توجد منتجات"}
            description={
              query
                ? "جرّب كلمة أخرى أو تصفّح كل المنتجات"
                : "ستظهر المنتجات هنا عند إضافتها"
            }
            actionLabel={query ? "عرض الكل" : undefined}
            actionHref={query ? "/products" : undefined}
            color="emerald"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
