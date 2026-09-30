// ══════════════════════════════════════════════
// CSV Export Helper — مشترك
// ══════════════════════════════════════════════

export function buildCSV(
  headers: string[],
  rows: (string | number | null | undefined)[][]
): string {
  const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.map(escape).join(","),
    ...rows.map((r) => r.map(escape).join(",")),
  ];
  return "\uFEFF" + lines.join("\n");
}

export function csvResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function requireAdmin(supabase: any, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role === "admin";
}

export const ROLE_AR: Record<string, string> = {
  admin: "مدير", supplier: "جملة",
  retailer: "سوبرماركت", delivery: "مندوب",
};

export const STATUS_AR: Record<string, string> = {
  pending: "قيد الانتظار", accepted: "مقبول",
  shipped: "قيد التوصيل", picked_up: "استلمه المندوب",
  delivered: "تم التسليم", cancelled: "ملغي",
};

export const PAY_STATUS_AR: Record<string, string> = {
  unpaid: "غير مدفوع", partial: "جزئي",
  paid: "مدفوع", refunded: "مسترجع",
};

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
