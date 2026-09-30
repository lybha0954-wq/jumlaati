import { NextResponse } from "next/server";
import { pointsService } from "@/lib/services/pointsService";
import { requireFeature } from "@/lib/feature-flags";

export async function GET() {
  try {
    const guard = await requireFeature("points");
    if (guard) return guard;
    const data = await pointsService.getMyPoints();
    return NextResponse.json(data || []);
  } catch (error: any) {
    const msg = error?.message || "خطأ غير معروف";
    if (msg.includes("دخول") || msg.includes("Unauthorized")) {
      return NextResponse.json({ error: msg }, { status: 401 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
