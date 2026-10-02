export const dynamic = "force-dynamic";

import { Topbar } from "@/components/dashboard/Topbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductCard } from "@/components/shared/ProductCard";
import { productService } from "@/lib/services/productService";
import { ProductsSearchBar } from "./ProductsSearchBar";
import { Package, Search, X, SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";

type SortKey = "newest" | "price_low" | "price_high" | "name";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest",     label: "الأحدث" },
  { key: "price_low",  label: "الأرخص أولاً" },
  { key: "price_high", label: "الأغلى أولاً" },
  { key: "name",       label: "الاسم (أ - ي)" },
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

  // ═══ إحصاء التصنيفات قبل الفلترة ═══
  const catCounts: Record<string, number> = {};
  products.forEach((p: any) => {
    if (p.category) {
      catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    }
  });
  const allCats = Object.keys(catCounts).sort();

  // ═══ فلترة ═══
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

  // ═══ ترتيب ═══
  filtered = [...filtered].sort((a: any, b: any) => {
    if (sort === "price_low") return Number(a.price || 0) - Number(b.price || 0);
    if (sort === "price_high") return Number(b.price || 0) - Number(a.price || 0);
    if (sort === "name") return String(a.name).localeCompare(String(b.name), "ar");
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  // ═══ بناء الروابط ═══
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

  const hasActiveFilters = !!(query || catFilter || sort !== "newest" || availOnly);
  const activeFiltersCount =
    (query ? 1 : 0) + (catFilter ? 1 : 0) + (sort !== "newest" ? 1 : 0) + (availOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 dark:bg-gray-950">
      <Topbar />

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* ═══ رأس الصفحة — بطاقة Hero ═══ */}
        <div className="mb-5 overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] p-6 text-white shadow-lg shadow-[#2e8b73]/15 dark:border-gray-800">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold backdrop-blur-sm">
                <Sparkles size={11} />
                من تجار الجملة في العراق
              </div>
              <h1 className="text-2xl font-black leading-tight sm:text-3xl">
                {query ? `نتائج: "${query}"` : "تصفّح المنتجات"}
              </h1>
              <p className="mt-1 text-sm text-white/80">
                {filtered.length} منتج من أصل {products.length}
              </p>
            </div>
            <div className="hidden h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm sm:flex">
              <Package className="h-10 w-10" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* ═══ البحث ═══ */}
        <div className="mb-4">
          <ProductsSearchBar initialQuery={query} />
        </div>

        {/* ═══ الفلاتر النشطة ═══ */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-gray-400">
              <SlidersHorizontal size={12} />
              فلاتر نشطة ({activeFiltersCount}):
            </div>

            {query && (
              <Link
                href={buildUrl({ q: null })}
                className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/30"
              >
                بحث: {query}
                <X size={11} className="text-gray-400 group-hover:text-red-500" />
              </Link>
            )}

            {catFilter && (
              <Link
                href={buildUrl({ cat: null })}
                className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/30"
              >
                تصنيف: {catFilter}
                <X size={11} className="text-gray-400 group-hover:text-red-500" />
              </Link>
            )}

            {sort !== "newest" && (
              <Link
                href={buildUrl({ sort: null })}
                className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/30"
              >
                ترتيب: {SORT_OPTIONS.find((o) => o.key === sort)?.label}
                <X size={11} className="text-gray-400 group-hover:text-red-500" />
              </Link>
            )}

            {availOnly && (
              <Link
                href={buildUrl({ avail: null })}
                className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-bold text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/30"
              >
                المتوفر فقط
                <X size={11} className="text-gray-400 group-hover:text-red-500" />
              </Link>
            )}

            <Link
              href="/products"
              className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold text-red-700 transition-colors hover:bg-red-200 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
            >
              مسح الكل
            </Link>
          </div>
        )}

        {/* ═══ فلاتر التصنيف (Chips) ═══ */}
        {allCats.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              التصنيفات
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Link
                href={buildUrl({ cat: null })}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  !catFilter
                    ? "bg-[#2e8b73] text-white shadow-md shadow-[#2e8b73]/20"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                الكل
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                    !catFilter
                      ? "bg-white/25 text-white"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {products.length}
                </span>
              </Link>
              {allCats.map((c) => (
                <Link
                  key={c}
                  href={buildUrl({ cat: c })}
                  className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    catFilter === c
                      ? "bg-[#2e8b73] text-white shadow-md shadow-[#2e8b73]/20"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                  }`}
                >
                  {c}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                      catFilter === c
                        ? "bg-white/25 text-white"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {catCounts[c]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ═══ الترتيب + التوفر ═══ */}
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
          {/* Sort dropdown — Link-based للعمل من Server Component */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
              ترتيب:
            </span>
            <div className="flex gap-1">
              {SORT_OPTIONS.map((o) => (
                <Link
                  key={o.key}
                  href={buildUrl({ sort: o.key })}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                    sort === o.key
                      ? "bg-gray-900 text-white shadow-sm dark:bg-gray-100 dark:text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  {o.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-1" />

          <Link
            href={buildUrl({ avail: availOnly ? null : "1" })}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all ${
              availOnly
                ? "bg-emerald-500 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${availOnly ? "bg-white" : "bg-emerald-500"}`} />
            المتوفر فقط
          </Link>
        </div>

        {/* ═══ المحتوى ═══ */}
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
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Footer صغير */}
            <div className="mt-8 text-center">
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                عرض {filtered.length} منتج
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
