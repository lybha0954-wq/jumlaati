"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { FilterChip } from "@/components/shared/FilterChip";
import Image from "next/image";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import {
  Store, Search, ArrowLeft, Phone, Package,
  Star, CheckCircle2, Filter, Heart, Coins,
} from "lucide-react";

interface Supplier {
  id: string;
  full_name?: string;
  name?: string;
  email: string;
  phone?: string;
  role: string;
}

interface SupplierStats {
  productCount: number;
  orderCount: number;
  lastOrderAt?: string;
}

type TopTab = "suppliers" | "favorites" | "points";
type FilterKey = "all" | "previous" | "new";

export default function ShopPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<Record<string, SupplierStats>>({});
  const [loading, setLoading] = useState(true);
  const [topTab, setTopTab] = useState<TopTab>("suppliers");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      fetch("/api/users?role=supplier").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()).catch(() => []),
      fetch("/api/orders").then((r) => r.json()).catch(() => []),
    ])
      .then(([suppliersRes, productsRes, ordersRes]) => {
        const list = Array.isArray(suppliersRes) ? suppliersRes : [];
        setSuppliers(list);

        const productsList = Array.isArray(productsRes) ? productsRes : (productsRes.products || []);
        const ordersList = Array.isArray(ordersRes) ? ordersRes : [];
        const statsMap: Record<string, SupplierStats> = {};

        productsList.forEach((p: any) => {
          const sid = p.supplier_id || p.owner_id;
          if (!sid) return;
          if (!statsMap[sid]) statsMap[sid] = { productCount: 0, orderCount: 0 };
          statsMap[sid].productCount += 1;
        });

        ordersList.forEach((o: any) => {
          const supplierName = o.supplier_name;
          if (!supplierName) return;
          const matched = list.find((s: Supplier) => (s.full_name || s.name) === supplierName);
          if (!matched) return;
          if (!statsMap[matched.id]) statsMap[matched.id] = { productCount: 0, orderCount: 0 };
          statsMap[matched.id].orderCount += 1;
          if (!statsMap[matched.id].lastOrderAt || new Date(o.created_at) > new Date(statsMap[matched.id].lastOrderAt!)) {
            statsMap[matched.id].lastOrderAt = o.created_at;
          }
        });

        setStats(statsMap);
      })
      .catch(() => showToast("فشل تحميل التجار", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filtered = useMemo(() => {
    let list = suppliers;
    if (filter === "previous") list = list.filter((s) => (stats[s.id]?.orderCount || 0) > 0);
    else if (filter === "new") list = list.filter((s) => (stats[s.id]?.orderCount || 0) === 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => {
        const name = (s.full_name || s.name || "").toLowerCase();
        return name.includes(q) || (s.phone || "").includes(q);
      });
    }
    return list.sort((a, b) => {
      const ca = stats[a.id]?.orderCount || 0;
      const cb = stats[b.id]?.orderCount || 0;
      return cb - ca;
    });
  }, [suppliers, stats, search, filter]);

  const previousCount = suppliers.filter((s) => (stats[s.id]?.orderCount || 0) > 0).length;
  const newCount = suppliers.length - previousCount;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">تسوّق</h1>
          <p className="text-sm text-gray-500">
            {topTab === "suppliers"
              ? suppliers.length > 0 ? `${suppliers.length} تاجر جملة متاح` : "اختر تاجر الجملة — ثم اختر منتجاتك"
              : topTab === "favorites" ? "منتجاتك المفضلة" : "نقاطك ومكافآتك"}
          </p>
        </div>

        <div className="mb-5 flex gap-2">
          <button onClick={() => setTopTab("suppliers")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
              topTab === "suppliers" ? "bg-[#2e8b73] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
            }`}>
            <Store size={14} /> التجار
          </button>
          <button onClick={() => setTopTab("favorites")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
              topTab === "favorites" ? "bg-[#2e8b73] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
            }`}>
            <Heart size={14} /> المفضلة
          </button>
          <button onClick={() => setTopTab("points")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
              topTab === "points" ? "bg-[#2e8b73] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
            }`}>
            <Coins size={14} /> نقاطي
          </button>
        </div>

        {topTab === "suppliers" && (
          <SuppliersView
            loading={loading} filtered={filtered} stats={stats}
            search={search} setSearch={setSearch}
            filter={filter} setFilter={setFilter}
            previousCount={previousCount} newCount={newCount}
            suppliersCount={suppliers.length}
          />
        )}
        {topTab === "favorites" && <FavoritesView />}
        {topTab === "points"    && <PointsView />}
      </div>
    </div>
  );
}

function SuppliersView({ loading, filtered, stats, search, setSearch, filter, setFilter, previousCount, newCount, suppliersCount }: any) {
  return (
    <>
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm focus-within:border-[#2e8b73]/40">
        <Search size={18} className="text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن تاجر..."
          className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none" />
      </div>

      {suppliersCount > 0 && (
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="الكل" count={suppliersCount} />
          <FilterChip active={filter === "previous"} onClick={() => setFilter("previous")} label="تعاملت معهم" count={previousCount} icon={<CheckCircle2 size={12} />} />
          <FilterChip active={filter === "new"} onClick={() => setFilter("new")} label="جدد" count={newCount} icon={<Star size={12} />} />
        </div>
      )}

      {loading ? (
        <div className="py-16"><LoadingSpinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          hasSearch={!!search}
          hasFilter={filter !== "all"}
          onReset={() => { setSearch(""); setFilter("all"); }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((s: Supplier) => {
            const stat = stats[s.id];
            const orderCount = stat?.orderCount || 0;
            const productCount = stat?.productCount || 0;
            const isPrevious = orderCount > 0;

            return (
              <Link key={s.id} href={`/retailer/shop/${s.id}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30 hover:shadow-md active:scale-[0.99]">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative flex-shrink-0">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                      isPrevious ? "bg-[#2e8b73] text-white" : "bg-[#e8f4f0] text-[#2e8b73]"
                    }`}>
                      <Store className="h-6 w-6" />
                    </div>
                    {isPrevious && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-white ring-2 ring-white">
                        ★
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-gray-900">
                      {s.full_name || s.name || "تاجر جملة"}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                      {productCount > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Package size={11} /> {productCount} منتج
                        </span>
                      )}
                      {orderCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[#1e6b57]">
                          <CheckCircle2 size={11} /> {orderCount} طلب
                        </span>
                      )}
                      {s.phone && productCount === 0 && orderCount === 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Phone size={11} /> <span dir="ltr">{s.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <ArrowLeft size={18}
                  className="flex-shrink-0 text-gray-300 transition-all group-hover:-translate-x-1 group-hover:text-[#2e8b73]" />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

function EmptyState({ hasSearch, hasFilter, onReset }: any) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
        <Store className="h-7 w-7 text-[#2e8b73]" />
      </div>
      <p className="text-sm font-bold text-gray-800">
        {hasSearch ? "لا نتائج مطابقة" : hasFilter ? "لا يوجد تجار في هذا التصنيف" : "لا يوجد تجار جملة بعد"}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        {hasSearch ? "جرّب كلمة أخرى" : hasFilter ? "جرّب تصنيفاً آخر" : "سيظهرون هنا عند تسجيلهم"}
      </p>
      {(hasSearch || hasFilter) && (
        <button onClick={onReset}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-4 py-2 text-xs font-bold text-white hover:bg-[#1e6b57] active:scale-95">
          <Filter size={12} /> عرض الكل
        </button>
      )}
    </div>
  );
}

function FavoritesView() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const remove = async (id: string) => {
    setRemoving(id);
    try {
      const res = await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("تم الحذف", "success");
        fetchWishlist();
      } else {
        showToast("فشل الحذف", "error");
      }
    } catch {
      showToast("خطأ", "error");
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return <div className="py-16"><LoadingSpinner /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
          <Heart className="h-8 w-8 text-rose-400" />
        </div>
        <p className="text-base font-bold text-gray-800">لا توجد منتجات مفضلة</p>
        <p className="mt-1 text-sm text-gray-500">عند حفظ منتجات، ستظهر هنا</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item: any) => {
        const p = item.products || item.product || {};
        const price = Number(p.price || 0);
        return (
          <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
              {p.image_url ? (
                <Image src={p.image_url} alt={p.name} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
              ) : (
                <Package className="h-6 w-6 text-gray-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900">{p.name || "منتج"}</p>
              <p className="mt-0.5 text-base font-black text-[#2e8b73]">{price.toLocaleString()} د.ع</p>
            </div>
            <button onClick={() => remove(item.id)} disabled={removing === item.id}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 text-rose-400 hover:border-rose-200 hover:bg-rose-50 disabled:opacity-50">
              <Heart size={16} fill="currentColor" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function PointsView() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchPoints = useCallback(async () => {
    try {
      const res = await fetch("/api/points");
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPoints(); }, [fetchPoints]);

  if (loading) {
    return <div className="py-16"><LoadingSpinner /></div>;
  }

  const total = items.reduce((s, p) => s + Number(p.points || 0), 0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#2e8b73]/30 bg-[#e8f4f0] p-5 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#2e8b73]">
          <Coins size={22} />
        </div>
        <p className="text-xs text-[#1e6b57]">رصيدك الحالي</p>
        <p className="mt-1 text-3xl font-black text-[#1e6b57]">{total}</p>
        <p className="mt-0.5 text-[10px] text-[#1e6b57]/70">نقطة ولاء</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="border-b border-gray-100 p-4">
          <h3 className="text-sm font-black text-gray-900">سجل النقاط</h3>
        </div>
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <Coins className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">لا توجد نقاط بعد</p>
            <p className="mt-1 text-xs text-gray-400">اجمع النقاط مع كل طلب</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {items.map((item: any) => {
              const pts = Number(item.points || 0);
              const isGain = pts > 0;
              return (
                <li key={item.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      {item.reason || (isGain ? "نقاط مكتسبة" : "استبدال نقاط")}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      {String(item.created_at || "").slice(0, 16)}
                    </p>
                  </div>
                  <p className={`text-base font-black ${isGain ? "text-[#2e8b73]" : "text-red-500"}`}>
                    {isGain ? "+" : ""}{pts}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
