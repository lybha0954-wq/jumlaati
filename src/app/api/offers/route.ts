import { NextResponse } from "next/server";

// ملاحظة: جدول offers غير موجود في Supabase حالياً.
// نُرجع مصفوفة فارغة مؤقتاً حتى يُنشأ الجدول أو يُعاد ربط الخدمة.

export async function GET() {
  try {
    const { offerService } = await import("@/lib/services/offerService");
    const data = await offerService.getActiveOffers();
    return NextResponse.json(data || []);
  } catch (error: any) {
    const msg = error?.message || "";
    // جدول مفقود = لا خطأ للمستخدم
    if (msg.includes("Could not find") || msg.includes("schema cache")) {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
