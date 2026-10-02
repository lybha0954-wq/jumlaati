import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsView } from "./AnalyticsView";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // ═══ تحقق من صلاحية الأدمن ═══
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") redirect("/");

  // ═══ جلب الطلبات (500 كحد أقصى) ═══
  const { data: rawOrders } = await supabase
    .from("orders")
    .select(`
      id, order_number, status, payment_status,
      subtotal, delivery_fee, commission, total_amount,
      retailer_id, supplier_id, delivery_id,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(500);

  const orders = rawOrders || [];

  // ═══ إثراء بأسماء الأطراف ═══
  const ids = new Set<string>();
  orders.forEach((o: any) => {
    if (o.retailer_id) ids.add(o.retailer_id);
    if (o.supplier_id) ids.add(o.supplier_id);
    if (o.delivery_id) ids.add(o.delivery_id);
  });

  let nameMap: Record<string, string> = {};
  if (ids.size > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", Array.from(ids));
    (profiles || []).forEach((p: any) => { nameMap[p.id] = p.full_name; });
  }

  const enrichedOrders = orders.map((o: any) => ({
    ...o,
    retailer_name: o.retailer_id ? nameMap[o.retailer_id] : null,
    supplier_name: o.supplier_id ? nameMap[o.supplier_id] : null,
    delivery_name: o.delivery_id ? nameMap[o.delivery_id] : null,
  }));

  return <AnalyticsView initialOrders={enrichedOrders} />;
}
