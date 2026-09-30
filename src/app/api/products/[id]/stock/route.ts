import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productId = Number(id);
    if (!productId) {
      return NextResponse.json({ error: 'invalid id' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile || !['supplier', 'admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const delta = Number(body.delta);
    if (isNaN(delta) || !isFinite(delta)) {
      return NextResponse.json({ error: 'invalid delta' }, { status: 400 });
    }

    const { data: product, error: getErr } = await supabase
      .from('products')
      .select('id, supplier_id, stock_quantity')
      .eq('id', productId)
      .maybeSingle();

    if (getErr || !product) {
      return NextResponse.json({ error: 'product not found' }, { status: 404 });
    }

    if (profile.role !== 'admin' && product.supplier_id !== user.id) {
      return NextResponse.json({ error: 'not your product' }, { status: 403 });
    }

    const current = Number(product.stock_quantity) || 0;
    const next = Math.max(0, current + Math.trunc(delta));

    const { error: updErr } = await supabase
      .from('products')
      .update({ stock_quantity: next })
      .eq('id', productId);

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, stock_quantity: next });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
