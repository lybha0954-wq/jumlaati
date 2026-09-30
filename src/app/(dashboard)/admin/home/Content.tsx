"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Users, Package, Wallet, TrendingUp, Store, Truck,
  ShoppingCart, ArrowLeft, BarChart3, Coins,
} from "lucide-react";

interface Order {
  id: number;
  status: string;
  total_amount: number;
  commission: number;
  created_at: string;
}

interface User {
  id: string;
  role: string;
  full_name: string;
}

export default function AdminHomeContent() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        fetch("/api/orders").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/admin/users").then((r) => (r.ok ? r.json() : [])),
      ]);
      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
      setUsers(Array.isArray(usersRes) ? usersRes : []);
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Topbar />
        <div className="flex items-center justify-center py-32"><LoadingSpinner /></div>
      </div>
    );
  }

  const delivered = orders.filter((o) => o.status === "delivered");
  const pending = orders.filter((o) => o.status === "pending");
  const active = orders.filter((o) =>
    ["accepted", "shipped", "picked_up"].includes(o.status)
  );

  const totalSales = delivered.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const totalCommission = delivered.reduce((s, o) => s + Number(o.commission || 0), 0);
  const netSales = totalSales - totalCommission;

  const suppliers = users.filter((u) => u.role === "supplier").length;
  const retailers = users.filter((u) => u.role === "retailer").length;
  const delivery = users.filter((u) => u.role === "delivery").length;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-black text-gray-900">مرحباً بك 👋</h1>
          <p className="text-sm text-gray-500">نظرة شاملة على النظام</p>
        </div>

        {/* Big stats */}
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <BigStat
            icon={<ShoppingCart className="h-5 w-5" />}
            label="إجمالي الطلبات"
            value={String(orders.length)}
            sub={`${pending.length} جديد`}
            color="blue"
          />
          <BigStat
            icon={<Wallet className="h-5 w-5" />}
            label="مبيعات مكتملة"
            value={formatCurrency(totalSales)}
            sub={`${delivered.length} طلب`}
            color="emerald"
          />
          <BigStat
            icon={<TrendingUp className="h-5 w-5" />}
            label="عمولة المنصة"
            value={formatCurrency(totalCommission)}
            sub="من المبيعات"
            color="amber"
          />
          <BigStat
            icon={<Coins className="h-5 w-5" />}
            label="صافي الموردين"
            value={formatCurrency(netSales)}
            sub="بعد العمولة"
            color="purple"
          />
        </div>

        {/* Users breakdown */}
        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-black text-gray-900">المستخدمون</h2>
            <Link
              href="/admin/users"
              className="group inline-flex items-center gap-1 text-xs font-semibold text-[#2e8b73]"
            >
              عرض الكل
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <UserCountCard
              icon={<Store className="h-5 w-5" />}
              label="تجار الجملة"
              value={suppliers}
              color="emerald"
            />
            <UserCountCard
              icon={<Users className="h-5 w-5" />}
              label="سوبرماركت"
              value={retailers}
              color="blue"
            />
            <UserCountCard
              icon={<Truck className="h-5 w-5" />}
              label="مندوبون"
              value={delivery}
              color="amber"
            />
          </div>
        </div>

        {/* Status breakdown */}
        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-4 text-base font-black text-gray-900">الطلبات حسب الحالة</h2>
          <div className="space-y-3">
            <StatusBar label="جديدة" value={pending.length} total={orders.length} color="bg-amber-500" />
            <StatusBar label="قيد التنفيذ" value={active.length} total={orders.length} color="bg-purple-500" />
            <StatusBar label="مكتملة" value={delivered.length} total={orders.length} color="bg-[#2e8b73]" />
            <StatusBar
              label="ملغية"
              value={orders.filter((o) => o.status === "cancelled").length}
              total={orders.length}
              color="bg-red-500"
            />
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="mb-3 text-lg font-black text-gray-900">وصول سريع</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <QuickLink href="/admin/users" icon={<Users size={18} />} label="المستخدمون" />
            <QuickLink href="/admin/analytics" icon={<BarChart3 size={18} />} label="التحليلات" />
            <QuickLink href="/admin/commissions" icon={<Coins size={18} />} label="العمولات" />
            <QuickLink href="/admin/settings" icon={<Package size={18} />} label="الإعدادات" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BigStat({ icon, label, value, sub, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
      <p className="mt-0.5 text-[10px] text-gray-400">{sub}</p>
    </div>
  );
}

function UserCountCard({ icon, label, value, color }: any) {
  const colors: any = {
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="text-center">
      <div className={`mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-xl font-black text-gray-900">{value}</p>
      <p className="mt-0.5 text-[11px] text-gray-500">{label}</p>
    </div>
  );
}

function StatusBar({ label, value, total, color }: any) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-bold text-gray-700">{label}</span>
        <span className="text-gray-500">{value} ({percent}%)</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function QuickLink({ href, icon, label }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30 hover:bg-[#e8f4f0]/30"
    >
      <span className="text-[#2e8b73]">{icon}</span>
      <span className="text-sm font-bold text-gray-800">{label}</span>
    </Link>
  );
}
