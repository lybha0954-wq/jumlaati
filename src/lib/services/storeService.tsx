import { supabase } from '@/lib/supabase/client';

export interface Store {
  id: string;
  name: string;
  ownerId?: string;
  ownerName?: string;
  phone?: string;
  address?: string;
  city?: string;
  isActive?: boolean;
  logo?: string;
  createdAt?: string;
}

function mapStore(s: Record<string, unknown>): Store {
  return {
    id: String(s.id ?? ''),
    name: String(s.name ?? s.store_name ?? s.business_name ?? s.full_name ?? ''),
    ownerId: s.owner_id ? String(s.owner_id) : undefined,
    ownerName: s.owner_name ? String(s.owner_name) : undefined,
    phone: s.phone ? String(s.phone) : undefined,
    address: s.address ? String(s.address) : undefined,
    city: s.city ? String(s.city) : undefined,
    isActive: s.is_active !== undefined ? Boolean(s.is_active) : true,
    logo: s.logo_url ? String(s.logo_url) : undefined,
    createdAt: s.created_at ? String(s.created_at) : undefined,
  };
}

export const storeService = {
  async getAll(): Promise<Store[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'retailer')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapStore);
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<Store | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data ? mapStore(data) : null;
    } catch {
      return null;
    }
  },

  async update(id: string, store: Partial<Store>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: store.name,
          phone: store.phone,
          address: store.address,
          city: store.city,
          is_active: store.isActive,
        })
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },
};
