import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/dev/introspect
 * يستعلم مباشرة من Supabase عن بنية كل جدول مهم.
 * يجلب أول سجل من كل جدول ويستخرج الأعمدة الفعلية.
 */

const TABLES_TO_INSPECT = [
  "user_profiles",
  "users",
  "products",
  "orders",
  "order_items",
  "relationships",
  "payments",
  "payouts",
  "notifications",
  "commissions",
  "refunds",
  "requests",
  "addresses",
  "wishlist",
  "chat_messages",
  "coupons",
  "offers",
  "audit_logs",
  "help_tickets",
  "points_transactions",
];

export async function GET() {
  try {
    const supabase = await createClient();

    const results: Record<string, any> = {};

    for (const tableName of TABLES_TO_INSPECT) {
      try {
        // نجلب سجلاً واحداً
        const { data, error, count } = await supabase
          .from(tableName)
          .select("*", { count: "exact" })
          .limit(1);

        if (error) {
          results[tableName] = {
            status: "error",
            error: error.message,
            code: error.code,
            hint: error.hint || null,
          };
          continue;
        }

        // استخرج أسماء الأعمدة من أول سجل
        const columns =
          data && data.length > 0
            ? Object.keys(data[0])
            : [];

        results[tableName] = {
          status: "ok",
          row_count: count ?? null,
          has_data: data && data.length > 0,
          columns,
          sample: data && data.length > 0 ? data[0] : null,
        };
      } catch (e: any) {
        results[tableName] = {
          status: "exception",
          error: e?.message || "خطأ",
        };
      }
    }

    return NextResponse.json({
      ok: true,
      inspected_at: new Date().toISOString(),
      tables: results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "خطأ" },
      { status: 500 }
    );
  }
}
