import { NextResponse } from 'next/server';
import { wholesaleService } from '@/lib/services/wholesaleService';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await wholesaleService.getMyProducts();
    const specific = product.find(p => p.id === params.id);
    if (!specific) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
    return NextResponse.json(specific);
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في جلب المنتج' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    // ملاحظة: يجب تمرير التحديثات إلى الخدمة
    const product = await wholesaleService.updateStock(params.id, body.stock); // هنا نعدل المخزون فقط كمثال
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في تحديث المنتج' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await wholesaleService.deleteProduct(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في حذف المنتج' }, { status: 500 });
  }
}
