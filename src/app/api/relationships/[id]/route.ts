import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const relId = Number(id);
    if (!relId) return NextResponse.json({ error: 'invalid id' }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const body = await req.json();
    const action = body.action;
    const newStatus =
      action === 'accept' ? 'active' :
      action === 'reject' ? 'rejected' :
      null;

    if (!newStatus) {
      return NextResponse.json({ error: 'invalid action' }, { status: 400 });
    }

    const { data: rel } = await supabase
      .from('relationships')
      .select('id, supplier_id, retailer_id, status')
      .eq('id', relId)
      .maybeSingle();

    if (!rel) return NextResponse.json({ error: 'not found' }, { status: 404 });

    // Only the supplier can accept/reject a pending request from a retailer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    const isAdmin = profile?.role === 'admin';
    if (!isAdmin && rel.supplier_id !== user.id) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const { error: updErr } = await supabase
      .from('relationships')
      .update({ status: newStatus })
      .eq('id', relId);

    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
    return NextResponse.json({ ok: true, status: newStatus });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
