import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return NextResponse.json([]);
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}
