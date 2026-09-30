import { createClient } from "@/lib/supabase/server";
import { buildCSV, csvResponse, requireAdmin, STATUS_AR, PAY_STATUS_AR, today } from "@/lib/export/csv";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!(await requireAdmin(supabase, user.id))) {
    return new Response("Forbidden", { status: 403 });
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return new Response(error.message, { status: 500 });

  const ids = new Set<string>();
  (orders || []).forEach((o: any) => {
    [o.retailer_id, o.supplier_id, o.delivery_id].forEach((x) => x && ids.add(x));
  });

  const { data: profiles } = ids.size
    ? await supabase.from("profiles").select("id, full_name").in("id", [...ids])
    : { data: [] as any[] };

  const nameMap = new Map<string, string>(
    (profiles || []).map((p: any) => [p.id, p.full_name || ""])
  );

  const headers = [
    "رقم الطلب", "التاريخ", "الحالة", "حالة الدفع",
    "تاجر الجملة", "السوبرماركت", "المندوب",
    "المجموع الفرعي", "رسوم التوصيل", "العمولة", "الإجمالي",
    "اسم المشتري", "عنوان التوصيل", "ملاحظات",
  ];
  const rows = (orders || []).map((o: any) => [
    o.id,
    String(o.created_at || "").slice(0, 16),
    STATUS_AR[o.status] || o.status || "",
    PAY_STATUS_AR[o.payment_status] || o.payment_status || "",
    nameMap.get(o.supplier_id) || "",
    nameMap.get(o.retailer_id) || "",
    nameMap.get(o.delivery_id) || "",
    Number(o.subtotal) || 0,
    Number(o.delivery_fee) || 0,
    Number(o.commission) || 0,
    Number(o.total_amount) || 0,
    o.buyer_name || "",
    o.delivery_address || "",
    o.notes || "",
  ]);

  return csvResponse(buildCSV(headers, rows), `jumlati-orders-${today()}.csv`);
}
