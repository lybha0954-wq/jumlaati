import { createClient } from "@/lib/supabase/server";
import { buildCSV, csvResponse, requireAdmin, today } from "@/lib/export/csv";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!(await requireAdmin(supabase, user.id))) {
    return new Response("Forbidden", { status: 403 });
  }

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return new Response(error.message, { status: 500 });

  const payerIds = new Set<string>();
  (payments || []).forEach((p: any) => p.paid_by && payerIds.add(p.paid_by));
  const { data: profiles } = payerIds.size
    ? await supabase.from("profiles").select("id, full_name").in("id", [...payerIds])
    : { data: [] as any[] };
  const nameMap = new Map<string, string>(
    (profiles || []).map((p: any) => [p.id, p.full_name || ""])
  );

  const methodAr: Record<string, string> = {
    cash: "نقداً", transfer: "حوالة",
    zaincash: "زين كاش", fastpay: "فاست باي",
  };

  const headers = [
    "ID", "رقم الطلب", "المبلغ", "الطريقة",
    "ملاحظة", "سجّلها", "التاريخ",
  ];
  const rows = (payments || []).map((p: any) => [
    p.id, p.order_id, Number(p.amount) || 0,
    methodAr[p.method] || p.method || "",
    p.note || "",
    nameMap.get(p.paid_by) || "",
    String(p.created_at || "").slice(0, 16),
  ]);

  return csvResponse(buildCSV(headers, rows), `jumlati-payments-${today()}.csv`);
}
