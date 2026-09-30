import { createClient } from "@/lib/supabase/server";
import { buildCSV, csvResponse, today } from "@/lib/export/csv";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "supplier" && profile?.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  let q = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (profile?.role === "supplier") q = q.eq("supplier_id", user.id);

  const { data, error } = await q;
  if (error) return new Response(error.message, { status: 500 });

  const statusAr: Record<string, string> = {
    available: "متوفر", low_stock: "مخزون منخفض",
    out_of_stock: "نافد", archived: "مؤرشف",
  };

  const headers = [
    "ID", "الاسم", "SKU", "السعر", "سعر التكلفة",
    "المخزون", "الحد الأدنى", "الوحدة", "الحالة", "نشط", "التاريخ",
  ];
  const rows = (data || []).map((p: any) => [
    p.id, p.name || "", p.sku || "",
    Number(p.price) || 0, Number(p.cost_price) || 0,
    Number(p.stock_quantity) || 0, Number(p.min_order_quantity) || 0,
    p.unit || "", statusAr[p.status] || p.status || "",
    p.is_active ? "نعم" : "لا",
    String(p.created_at || "").slice(0, 16),
  ]);

  return csvResponse(buildCSV(headers, rows), `jumlati-my-products-${today()}.csv`);
}
