"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { Users, Search, Phone, Check, X, Shield } from "lucide-react";

interface UserProfile {
  id: string; name?: string; full_name?: string; email?: string;
  phone?: string; role: string; active?: number; business_name?: string;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "مدير", owner: "مالك", supplier: "جملة",
  retailer: "سوبرماركت", delivery: "مندوب",
};
const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-50 text-red-700",
  owner: "bg-red-50 text-red-700",
  supplier: "bg-amber-50 text-amber-700",
  retailer: "bg-blue-50 text-blue-700",
  delivery: "bg-emerald-50 text-emerald-700",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filtered, setFiltered] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setUsers(list);
      setFiltered(list);
    } catch { showToast("فشل التحميل", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    let list = users;
    if (activeFilter !== "all") {
      list = list.filter((u) => u.role === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) =>
        (u.name || u.full_name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.phone || "").includes(q)
      );
    }
    setFiltered(list);
  }, [search, activeFilter, users]);

  const counts = {
    all: users.length,
    supplier: users.filter((u) => u.role === "supplier").length,
    retailer: users.filter((u) => u.role === "retailer").length,
    delivery: users.filter((u) => u.role === "delivery").length,
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">المستخدمون</h1>
          <p className="text-sm text-gray-500">{users.length} مستخدم في النظام</p>
        </div>

        {/* البحث */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm focus-within:border-[#2e8b73]/40">
          <Search size={18} className="text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو البريد أو الهاتف..."
            className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none" />
        </div>

        {/* فلاتر الأدوار */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          <FilterBtn active={activeFilter === "all"} onClick={() => setActiveFilter("all")} label="الكل" count={counts.all} />
          <FilterBtn active={activeFilter === "supplier"} onClick={() => setActiveFilter("supplier")} label="جملة" count={counts.supplier} />
          <FilterBtn active={activeFilter === "retailer"} onClick={() => setActiveFilter("retailer")} label="سوبرماركت" count={counts.retailer} />
          <FilterBtn active={activeFilter === "delivery"} onClick={() => setActiveFilter("delivery")} label="مندوب" count={counts.delivery} />
        </div>

        {loading ? (
          <div className="py-16"><LoadingSpinner /></div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
              <Users className="h-7 w-7 text-[#2e8b73]" />
            </div>
            <p className="text-sm font-bold text-gray-800">لا نتائج</p>
            <p className="mt-1 text-xs text-gray-500">جرّب بحثاً آخر</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((u) => {
              const name = u.name || u.full_name || "مستخدم";
              const initial = name.charAt(0).toUpperCase();
              return (
                <div key={u.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e8f4f0] to-[#d1e7e0] text-lg font-black text-[#1e6b57]">
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">{name}</p>
                    {u.phone && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                        <Phone size={11} />
                        <span dir="ltr">{u.phone}</span>
                      </p>
                    )}
                    {u.email && !u.email.includes("@jumlaati.iq") && (
                      <p className="truncate text-[11px] text-gray-400">{u.email}</p>
                    )}
                  </div>
                  <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${ROLE_COLORS[u.role] || "bg-gray-50 text-gray-600"}`}>
                    {ROLE_LABELS[u.role] || u.role}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, label, count }: any) {
  return (
    <button onClick={onClick}
      className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
        active
          ? "bg-[#2e8b73] text-white shadow-md shadow-[#2e8b73]/20"
          : "border border-gray-100 bg-white text-gray-600 hover:border-[#2e8b73]/30 hover:text-[#1e6b57]"
      }`}>
      {label}
      {count > 0 && (
        <span className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] ${
          active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
        }`}>{count}</span>
      )}
    </button>
  );
}
