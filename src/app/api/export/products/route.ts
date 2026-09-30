import { createClient } from "@/lib/supabase/server";
import { buildCSV, csvResponse, requireAdmin, today } from "@/lib/export/csv";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!(await requireAdmin(supabase, user.id))) {
    return new Response("Forbidden", { status: 403 });
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return new Response(error.message, { status: 500 });

  const supIds = new Set<string>();
  (products || []).forEach((p: any) => p.supplier_id && supIds.add(p.supplier_id));
  const { data: profiles } = supIds.size
    ? await supabase.from("profiles").select("id, full_name").in("id", [...supIds])
    : { data: [] as any[] };
  const nameMap = new Map<string, string>(
    (profiles || []).map((p: any) => [p.id, p.full_name || ""])
  );

  const statusAr: Record<string, string> = {
    available: "متوفر", low_stock: "مخزون منخفض",
    out_of_stock: "نافد", archived: "مؤرشف",
  };

  const headers = [
    "ID", "الاسم", "SKU", "المورد",
    "السعر", "سعر التكلفة", "المخزون", "الحد الأدنى",
    "الوحدة", "الحالة", "نشط", "تاريخ الإنشاء",
  ];
  const rows = (products || []).map((p: any) => [
    p.id, p.name || "", p.sku || "",
    nameMap.get(p.supplier_id) || "",
    Number(p.price) || 0, Number(p.cost_price) || 0,
    Number(p.stock_quantity) || 0, Number(p.min_order_quantity) || 0,
    p.unit || "", statusAr[p.status] || p.status || "",
    p.is_active ? "نعم" : "لا",
    String(p.created_at || "").slice(0, 16),
  ]);

  return csvResponse(buildCSV(headers, rows), `jumlati-products-${today()}.csv`);
}
