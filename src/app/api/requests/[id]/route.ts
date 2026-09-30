import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireFeature } from "@/lib/feature-flags";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireFeature("requests");
    if (guard) return guard;
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase.from('requests').select('*').eq('id', id).maybeSingle();
    if (error || !data) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireFeature("requests");
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
    const body = await req.json();
    const updates: any = {};
    if (body.status) updates.status = body.status;
    if (body.admin_reply !== undefined) updates.admin_reply = body.admin_reply;
    updates.reviewed_by = user.id;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('requests').update(updates).eq('id', id).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
