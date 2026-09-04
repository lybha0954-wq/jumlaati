import { NextResponse } from 'next/server';
import { wholesaleService } from '@/lib/services/wholesaleService';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const products = await wholesaleService.getMyProducts();
    const specific = products.find(p => p.id === id);
    if (!specific) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
    return NextResponse.json(specific);
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في جلب المنتج' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const product = await wholesaleService.updateProduct(id, body);
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في تحديث المنتج' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await wholesaleService.deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في حذف المنتج' }, { status: 500 });
  }
}
