import { NextResponse } from "next/server";
import { wishlistService } from "@/lib/services/wishlistService";

function handleError(error: any) {
  const msg = error?.message || "خطأ غير معروف";
  if (msg.includes("دخول") || msg.includes("Unauthorized")) {
    return NextResponse.json({ error: msg }, { status: 401 });
  }
  return NextResponse.json({ error: msg }, { status: 500 });
}

export async function GET() {
  try {
    const data = await wishlistService.getMyWishlist();
    return NextResponse.json(data || []);
  } catch (error: any) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    const data = await wishlistService.addToWishlist(productId);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return handleError(error);
  }
}
