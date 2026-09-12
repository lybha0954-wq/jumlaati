import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      user: null,
      supabase: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { user, supabase, error: null };
}

export async function requireRole(roles: string[]) {
  const { user, supabase, error } = await requireUser();
  if (error || !user || !supabase) return { user: null, supabase: null, error };

  const { data: check } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!check || !roles.includes(check.role)) {
    return {
      user: null,
      supabase: null,
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }
  return { user, supabase, error: null };
}
