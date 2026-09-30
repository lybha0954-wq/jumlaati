import { createClient } from "@/lib/supabase/server";
import { buildCSV, csvResponse, requireAdmin, ROLE_AR, today } from "@/lib/export/csv";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!(await requireAdmin(supabase, user.id))) {
    return new Response("Forbidden", { status: 403 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return new Response(error.message, { status: 500 });

  const headers = [
    "ID", "الاسم", "البريد", "الهاتف", "الدور",
    "اسم النشاط", "المحافظة", "المنطقة", "نشط", "تاريخ الإنشاء",
  ];
  const rows = (data || []).map((u: any) => [
    u.id, u.full_name || "", u.email || "", u.phone || "",
    ROLE_AR[u.role] || u.role || "",
    u.business_name || "", u.governorate || "", u.district || "",
    u.is_active ? "نعم" : "لا",
    String(u.created_at || "").slice(0, 16),
  ]);

  return csvResponse(buildCSV(headers, rows), `jumlati-users-${today()}.csv`);
}
