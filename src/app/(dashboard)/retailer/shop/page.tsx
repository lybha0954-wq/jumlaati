"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { Store, Search, ArrowLeft, Phone } from "lucide-react";

interface Supplier {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
}

export default function ShopPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filtered, setFiltered] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/users?role=supplier")
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : [];
        setSuppliers(list);
        setFiltered(list);
      })
      .catch(() => showToast("فشل تحميل التجار", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(suppliers);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      suppliers.filter(
        (s) =>
          (s.full_name || "").toLowerCase().includes(q) ||
          (s.phone || "").includes(q)
      )
    );
  }, [search, suppliers]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* العنوان */}
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-black text-gray-900">تسوّق</h1>
          <p className="text-sm text-gray-500">
            اختر تاجر الجملة — ثم اختر منتجاتك
          </p>
        </div>

        {/* البحث */}
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-[#2e8b73]/40">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن تاجر..."
            className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
          />
        </div>

        {/* المحتوى */}
        {loading ? (
          <div className="py-16">
            <LoadingSpinner />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
              <Store className="h-7 w-7 text-[#2e8b73]" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {search ? "لا نتائج مطابقة" : "لا يوجد تجار جملة بعد"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {search ? "جرّب كلمة أخرى" : "سيظهرون هنا عند تسجيلهم"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => (
              <Link
                key={s.id}
                href={`/retailer/shop/${s.id}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30 hover:shadow-md hover:shadow-[#2e8b73]/5 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73] transition-transform group-hover:scale-110">
                    <Store className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-gray-900">
                      {s.full_name || "تاجر جملة"}
                    </p>
                    {s.phone && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                        <Phone size={11} />
                        <span dir="ltr">{s.phone}</span>
                      </p>
                    )}
                  </div>
                </div>
                <ArrowLeft
                  size={18}
                  className="text-gray-300 transition-all group-hover:-translate-x-1 group-hover:text-[#2e8b73]"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
