import Link from "next/link";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/dashboard/Topbar";
import { KpiCard } from "@/components/shared/KpiCard";
import { formatCurrency } from "@/lib/utils/currency";
import { getStatusInfo } from "@/lib/constants/order-status";
import { createClient } from "@/lib/supabase/server";
import {
  ShoppingCart, Clock, CheckCircle2, Wallet, Package, Store, ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Order {
  id: number;
  order_number?: string;
  status: string;
  total_amount: number;
  created_at: string;
  supplier_id?: string;
  supplier_name?: string;
}

export default async function RetailerOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // ═══ جلب الطلبات مباشرة من DB (50 طلب كحد أقصى) ═══
  const { data: rawOrders } = await supabase
    .from("orders")
    .select(`
      id, order_number, status, total_amount,
      created_at, supplier_id
    `)
    .eq("retailer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const orders = rawOrders || [];

  // ═══ إثراء بأسماء الموردين ═══
  const supplierIds = [...new Set(orders.map((o: any) => o.supplier_id).filter(Boolean))];
  let nameMap: Record<string, string> = {};
  if (supplierIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", supplierIds as string[]);
    (profiles || []).forEach((p: any) => { nameMap[p.id] = p.full_name; });
  }

  const ordersList: Order[] = orders.map((o: any) => ({
    ...o,
    supplier_name: o.supplier_id ? nameMap[o.supplier_id] : null,
  }));

  // ═══ حساب الإحصائيات على الخادم ═══
  const pending = ordersList.filter((o) => o.status === "pending").length;
  const active = ordersList.filter((o) =>
    ["accepted", "shipped", "picked_up"].includes(o.status)
  ).length;
  const delivered = ordersList.filter((o) => o.status === "delivered").length;
  const spent = ordersList
    .filter((o) => o.status === "delivered")
    .reduce((s, o) => s + Number(o.total_amount || 0), 0);

  const recent = ordersList.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-black text-gray-900">مرحباً بك 👋</h1>
          <p className="text-sm text-gray-500">نظرة سريعة على طلباتك ومشترياتك</p>
        </div>

        <Link href="/products"
          className="group mb-6 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] p-5 text-white shadow-lg shadow-[#2e8b73]/20 transition-all hover:shadow-xl active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Store className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-base font-black">تسوّق الآن</div>
              <div className="text-xs text-white/80">من تجار الجملة</div>
            </div>
          </div>
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        </Link>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <KpiCard
            icon={<Clock className="h-5 w-5" />}
            label="بانتظار الموافقة"
            value={String(pending)}
            color="amber"
            highlight={pending > 0}
          />
          <KpiCard
            icon={<Package className="h-5 w-5" />}
            label="قيد التنفيذ"
            value={String(active)}
            color="purple"
          />
          <KpiCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="إجمالي الطلبات"
            value={String(ordersList.length)}
            color="blue"
          />
          <KpiCard
            icon={<Wallet className="h-5 w-5" />}
            label="إجمالي المشتريات"
            value={formatCurrency(spent)}
            color="emerald"
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <h2 className="text-base font-black text-gray-900">أحدث طلباتي</h2>
            <Link href="/retailer/orders"
              className="group inline-flex items-center gap-1 text-xs font-semibold text-[#2e8b73] hover:text-[#1e6b57]">
              عرض الكل
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4f0]">
                <ShoppingCart className="h-6 w-6 text-[#2e8b73]" />
              </div>
              <p className="text-sm text-gray-500">لا توجد طلبات بعد</p>
              <p className="mt-1 text-xs text-gray-400">تصفّح المنتجات وابدأ التسوق</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recent.map((o) => {
                const st = getStatusInfo(o.status);
                const orderLabel = o.order_number || `#${String(o.id).slice(0, 8)}`;
                return (
                  <li key={o.id}>
                    <Link href={`/orders/${o.id}`}
                      className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                          <Store className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{orderLabel}</p>
                          <p className="text-xs text-gray-500">{o.supplier_name || "تاجر جملة"}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-[#2e8b73]">{formatCurrency(o.total_amount)}</p>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${st.className}`}>
                          {st.label}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
