import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    platformName: 'جُمْلَتِي',
    currency: 'IQD',
    commissionRate: 0.025,
    supportPhone: '+9647700000000',
  });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  return NextResponse.json({ success: true, ...body });
}
