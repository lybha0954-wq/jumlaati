import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json([], { status: 401 });

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    let query = supabase
      .from('profiles')
      .select('id, full_name, phone, role, business_name, governorate');

    if (role) {
      // Normalize legacy role names
      const normalized =
        role === 'wholesaler' ? 'supplier' :
        role === 'store' ? 'retailer' :
        role;
      query = query.eq('role', normalized);
    }

    const { data, error } = await query.order('full_name', { ascending: true });

    if (error) {
      console.error('[api/users] error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
