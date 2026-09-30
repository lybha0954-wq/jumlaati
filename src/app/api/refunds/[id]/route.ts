import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireFeature } from "@/lib/feature-flags";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireFeature("refunds");
    if (guard) return guard;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await req.json();
    const valid = ['pending', 'approved', 'rejected', 'refunded'];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('refunds')
      .update({ status, reviewed_by: user.id })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
