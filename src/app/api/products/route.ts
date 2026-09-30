import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { searchParams } = new URL(req.url);
    const supplierId = searchParams.get('supplier_id');

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (supplierId) {
      // Public access to a specific supplier catalog
      query = query.eq('supplier_id', supplierId);
    } else if (user) {
      // If logged-in user is a supplier, show only their own products
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role === 'supplier') {
        query = query.eq('supplier_id', user.id);
      }
      // retailer / admin / delivery: no filter → see all
    }
    // guests: no filter → see all

    const { data, error } = await query;
    if (error) {
      console.error('[api/products] error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
    const { name, price, stock, stock_quantity, category_id, description } = body;

    if (!name || !price || Number(price) <= 0) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        supplier_id: user.id,
        name: String(name).trim(),
        price: Number(price),
        stock_quantity: Number(stock_quantity ?? stock) || 0,
        category_id: category_id || null,
        description: description || null,
        unit: 'قطعة',
        status: 'available',
        is_active: true,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, product: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
