"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListSkeleton, KPISkeleton } from "@/components/shared/SkeletonLoader";
import { useToast } from "@/hooks/useToast";
import { Users, Store, Truck, Shield, Package, Search, Download } from "lucide-react";

interface User {
  id: string;
  email: string | null;
  full_name: string;
  phone: string | null;
  role: string;
  business_name?: string | null;
  governorate?: string | null;
  is_active: boolean;
  created_at: string;
  items_count: number;
}

type RoleFilter = "all" | "supplier" | "retailer" | "delivery" | "admin";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RoleFilter>("all");
  const [search, setSearch] = useState("");
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = res.ok ? await res.json() : [];
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter((u) => {
    if (filter !== "all" && u.role !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.phone || "").includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: users.length,
    supplier: users.filter((u) => u.role === "supplier").length,
    retailer: users.filter((u) => u.role === "retailer").length,
    delivery: users.filter((u) => u.role === "delivery").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24">
        <Topbar />
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="mb-5">
            <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-40 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="mb-5">
            <KPISkeleton count={4} />
          </div>
          <ListSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h1 className="mb-1 text-2xl font-black text-gray-900">المستخدمون</h1>
            <p className="text-sm text-gray-500">{users.length} مستخدم في النظام</p>
          </div>
          <a
            href="/api/export/users"
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:border-[#2e8b73]/40 hover:text-[#2e8b73]"
          >
            <Download size={14} /> تصدير CSV
          </a>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard icon={<Store size={16} />} label="تجار الجملة" value={counts.supplier} color="emerald" />
          <StatCard icon={<Users size={16} />} label="السوبرماركت" value={counts.retailer} color="blue" />
          <StatCard icon={<Truck size={16} />} label="المندوبون" value={counts.delivery} color="amber" />
          <StatCard icon={<Shield size={16} />} label="الإدارة" value={counts.admin} color="purple" />
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو البريد أو الهاتف..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {(["all","supplier","retailer","delivery","admin"] as RoleFilter[]).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                filter === k
                  ? "bg-[#2e8b73] text-white shadow-md shadow-[#2e8b73]/20"
                  : "border border-gray-100 bg-white text-gray-600 hover:border-[#2e8b73]/30 hover:text-[#1e6b57]"
              }`}
            >
              {labelOf(k)}
              {counts[k] > 0 && (
                <span className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] ${
                  filter === k ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                }`}>{counts[k]}</span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={search || filter !== "all" ? "لا نتائج مطابقة" : "لا يوجد مستخدمون بعد"}
            description={search || filter !== "all" ? "جرّب تغيير الفلتر أو البحث" : "سيظهر المستخدمون هنا بعد التسجيل"}
            color="gray"
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((u) => {
              const meta = roleMeta(u.role);
              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${meta.bg} ${meta.text}`}>
                      <meta.Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-black text-gray-900">{u.full_name}</p>
                        {!u.is_active && (
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">
                            معطّل
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-500" dir="ltr">
                        {u.email || "—"}
                      </p>
                      <p className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-400">
                        <span>{meta.label}</span>
                        {u.phone && <span dir="ltr">• {u.phone}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                      {u.items_count} {meta.countLabel}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(u.created_at).toLocaleDateString("ar-IQ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${colors[color]}`}>
        {icon}
      </div>
      <p className="mb-0.5 text-xs text-gray-500">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  );
}

function labelOf(role: RoleFilter): string {
  const map: Record<string, string> = {
    all: "الكل", supplier: "تجار الجملة",
    retailer: "سوبرماركت", delivery: "مندوبون", admin: "إدارة",
  };
  return map[role] || role;
}

function roleMeta(role: string) {
  const map: Record<string, any> = {
    supplier: { label: "تاجر جملة", bg: "bg-[#e8f4f0]", text: "text-[#2e8b73]", Icon: Store, countLabel: "منتج" },
    retailer: { label: "سوبرماركت", bg: "bg-blue-50", text: "text-blue-600", Icon: Users, countLabel: "طلب" },
    delivery: { label: "مندوب توصيل", bg: "bg-amber-50", text: "text-amber-600", Icon: Truck, countLabel: "مهمة" },
    admin:    { label: "مدير", bg: "bg-purple-50", text: "text-purple-600", Icon: Shield, countLabel: "إجراء" },
  };
  return map[role] || map.retailer;
}
