import { NextResponse } from 'next/server';
; // لو كنت قد أنشأتها، أو استخدم خدمة الجملة/التاجر حسب الدور

// هنا سنستخدم خدمة الجملة لأن إضافة المنتجات تكون من تاجر الجملة أو الأدمن
import { wholesaleService } from '@/lib/services/wholesaleService';

export async function GET() {
  try {
    const products = await wholesaleService.getMyProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في جلب المنتجات' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await wholesaleService.createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في إنشاء المنتج' }, { status: 400 });
  }
}
