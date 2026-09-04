import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { addressSchema } from '@/lib/validations/address.schema';
import { addressService } from '@/lib/services/addressService';

export async function GET() {
  try {
    const data = await addressService.getMyAddresses();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = addressSchema.parse(body);
    const data = await addressService.addAddress(parsed);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
