'use client';

import { createClient } from '@/lib/supabase/client';

export interface Store {
  id: string;
  name: string;
  owner: string;
  phone: string;
  city: string;
  status: 'active' | 'pending' | 'suspended';
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  creditLimit: number;
}

function toStore(row: any): Store {
  return {
    id: row.id,
    name: row.name,
    owner: row.owner ?? '',
    phone: row.phone ?? '',
    city: row.city ?? '',
    status: row.status as Store['status'],
    joinDate: row.join_date ?? '',
    totalOrders: row.total_orders ?? 0,
    totalSpent: row.total_spent ?? 0,
    creditLimit: row.credit_limit ?? 0,
  };
}

function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const cls = error.code.substring(0, 2);
    if (cls === '42' || cls === '08') return true;
    if (cls === '23') return false;
  }
  return false;
}

export const storeService = {
  async getAll(): Promise<Store[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) { if (isSchemaError(error)) throw error; return []; }
      return (data ?? []).map(toStore);
    } catch (e: any) { if (isSchemaError(e)) throw e; return []; }
  },

  async updateStatus(id: string, status: Store['status']): Promise<boolean> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('stores')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) { if (isSchemaError(error)) throw error; return false; }
      return true;
    } catch (e: any) { if (isSchemaError(e)) throw e; return false; }
  },
};
