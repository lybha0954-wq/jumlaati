import { NextResponse } from 'next/server';
import { productService } from '@/lib/services/productService';

export async function GET() {
  try {
    const products = await productService.getAll();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await productService.create(body);
    if (!created) {
      return NextResponse.json({ error: 'Failed to create product' }, { status: 400 });
    }
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
