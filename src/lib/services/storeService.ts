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
// أضف داخل storeService
async uploadProfileImage(file: File, type: 'avatar' | 'logo'): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await fetch('/api/profile/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'فشل رفع الصورة');
  }

  const data = await response.json();
  return data.publicUrl;
},

async deleteProfileImage(type: 'avatar' | 'logo'): Promise<boolean> {
  // أولاً نجلب الرابط الحالي لنعرف مساره
  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select(type === 'avatar' ? 'avatar_url' : 'store_logo')
    .single();

  const imageUrl = type === 'avatar' ? profile?.avatar_url : profile?.store_logo;
  if (!imageUrl) return true; // لا يوجد صورة لحذفها

  // استخراج المسار من الرابط
  const path = imageUrl.split('/store-assets/')[1];
  if (!path) return false;

  // حذف من التخزين
  const { error: storageError } = await supabase.storage
    .from('store-assets')
    .remove([path]);

  if (storageError) {
    console.error('Delete Storage Error:', storageError);
    return false;
  }

  // تحديث الحقل في قاعدة البيانات إلى null
  const updateData = type === 'avatar' ? { avatar_url: null } : { store_logo: null };
  const { error: updateError } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', (await supabase.auth.getUser()).data.user?.id);

  if (updateError) {
    console.error('Delete DB Error:', updateError);
    return false;
  }

  return true;
}
