import { NextResponse } from "next/server";
import { addressSchema } from "@/lib/validations/address.schema";
import { addressService } from "@/lib/services/addressService";

function handleError(error: any) {
  const msg = error?.message || "خطأ غير معروف";
  if (msg.includes("دخول") || msg.includes("Unauthorized")) {
    return NextResponse.json({ error: msg }, { status: 401 });
  }
  return NextResponse.json({ error: msg }, { status: 500 });
}

export async function GET() {
  try {
    const data = await addressService.getMyAddresses();
    return NextResponse.json(data || []);
  } catch (error: any) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = addressSchema.parse(body);
    const data = await addressService.addAddress(parsed);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    const msg = error?.message || "خطأ غير معروف";
    if (msg.includes("دخول") || msg.includes("Unauthorized")) {
      return NextResponse.json({ error: msg }, { status: 401 });
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
