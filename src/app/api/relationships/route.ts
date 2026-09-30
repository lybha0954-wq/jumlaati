import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json([], { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = profile?.role || 'retailer';

    // Fetch relationships where the user is either supplier or retailer
    let query = supabase
      .from('relationships')
      .select(`
        id, status, requested_by, created_at,
        supplier_id, retailer_id
      `);

    if (role === 'supplier') {
      query = query.eq('supplier_id', user.id).eq('status', 'pending');
    } else if (role === 'retailer') {
      query = query.eq('retailer_id', user.id).eq('status', 'pending');
    } else {
      // admin sees all pending
      query = query.eq('status', 'pending');
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.error('[relationships] error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enrich with retailer/supplier names
    const ids = new Set<string>();
    (data || []).forEach((r: any) => {
      if (r.retailer_id) ids.add(r.retailer_id);
      if (r.supplier_id) ids.add(r.supplier_id);
    });

    let nameMap: Record<string, any> = {};
    if (ids.size > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, phone, role')
        .in('id', Array.from(ids));
      (profiles || []).forEach((p: any) => { nameMap[p.id] = p; });
    }

    const items = (data || []).map((r: any) => {
      const ret = nameMap[r.retailer_id];
      const sup = nameMap[r.supplier_id];
      return {
        id: r.id,
        status: r.status,
        requested_by: r.requested_by,
        created_at: r.created_at,
        retailer_id: r.retailer_id,
        supplier_id: r.supplier_id,
        retailer_name: ret?.full_name || null,
        retailer_phone: ret?.phone || null,
        supplier_name: sup?.full_name || null,
        supplier_phone: sup?.phone || null,
      };
    });

    return NextResponse.json(items);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const body = await req.json();
    const supplier_id = body.supplier_id;
    if (!supplier_id) {
      return NextResponse.json({ error: 'supplier_id required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('relationships')
      .insert({
        supplier_id,
        retailer_id: user.id,
        status: 'pending',
        requested_by: user.id,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, relationship: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
