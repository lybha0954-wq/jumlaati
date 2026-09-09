import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { wholesaleService } from '@/lib/services/wholesaleService';

export async function GET() {
  try {
    const supabase = await createClient(); // تعديل
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
