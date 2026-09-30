import { NextResponse } from "next/server";
import { getPlans } from "@/lib/subscriptions/helper";

export async function GET() {
  try {
    const plans = await getPlans();
    return NextResponse.json(plans);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
