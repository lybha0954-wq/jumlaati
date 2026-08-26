import { supabase } from '@/lib/supabase/client';

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  isActive?: boolean;
  logo?: string;
  description?: string;
  rating?: number;
  totalOrders?: number;
  createdAt?: string;
}

function mapSupplier(s: Record<string, unknown>): Supplier {
  return {
    id: String(s.id ?? ''),
    name: String(s.name ?? s.business_name ?? s.full_name ?? ''),
    email: s.email ? String(s.email) : undefined,
    phone: s.phone ? String(s.phone) : undefined,
    address: s.address ? String(s.address) : undefined,
    city: s.city ? String(s.city) : undefined,
    isActive: s.is_active !== undefined ? Boolean(s.is_active) : true,
    logo: s.logo_url ? String(s.logo_url) : undefined,
    description: s.description ? String(s.description) : undefined,
    rating: s.rating ? Number(s.rating) : undefined,
    totalOrders: s.total_orders ? Number(s.total_orders) : undefined,
    createdAt: s.created_at ? String(s.created_at) : undefined,
  };
}

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'supplier')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapSupplier);
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<Supplier | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data ? mapSupplier(data) : null;
    } catch {
      return null;
    }
  },

  async update(id: string, supplier: Partial<Supplier>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: supplier.name,
          phone: supplier.phone,
          address: supplier.address,
          city: supplier.city,
          is_active: supplier.isActive,
          description: supplier.description,
        })
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },
};