import { NextResponse } from "next/server";
import { wishlistService } from "@/lib/services/wishlistService";
import { requireFeature } from "@/lib/feature-flags";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireFeature("wishlist");
    if (guard) return guard;

    const { id } = await params;
    await wishlistService.removeFromWishlist(id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    const msg = error?.message || "خطأ";
    const status = msg.includes("دخول") ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
