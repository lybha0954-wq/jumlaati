'use client';

import { createClient } from '@/lib/supabase/client';

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  costPrice: number;
  originalPrice: number;
  finalPrice: number;
  stock: number;
  minOrderQty: number;
  status: 'متوفر' | 'منخفض' | 'نفد' | 'موقوف';
  unit: string;
  supplierId?: string;
  supplierName?: string;
  supplierRating?: number;
  deliveryDays?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

const SELECT_FIELDS =
  'id, barcode, name, category, cost_price, original_price, final_price, stock, min_order_qty, status, unit, supplier_id, supplier_name, supplier_rating, delivery_days';

function toProduct(row: any): Product {
  return {
    id: row.id,
    barcode: row.barcode ?? '',
    name: row.name ?? '',
    category: row.category ?? '',
    costPrice: row.cost_price ?? 0,
    originalPrice: row.original_price ?? 0,
    finalPrice: row.final_price ?? 0,
    stock: row.stock ?? 0,
    minOrderQty: row.min_order_qty ?? 1,
    status: row.status,
    unit: row.unit ?? 'قطعة',
    supplierId: row.supplier_id ?? '',
    supplierName: row.supplier_name ?? '',
    supplierRating: row.supplier_rating ?? 4.5,
    deliveryDays: row.delivery_days ?? 1,
  };
}

const EMPTY: PaginatedResult<Product> = {
  data: [],
  total: 0,
  page: 1,
  perPage: 20,
  hasMore: false,
};

export const productService = {
  async getPaginated(
    page = 1,
    perPage = 20,
    filters?: { category?: string; supplierId?: string; search?: string }
  ): Promise<PaginatedResult<Product>> {
    const supabase = createClient();
    if (!supabase) return { ...EMPTY, page, perPage };

    try {
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      let query = supabase
        .from('products')
        .select(SELECT_FIELDS, { count: 'exact' })
        .neq('status', 'موقوف')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (filters?.category && filters.category !== 'الكل') {
        query = query.eq('category', filters.category);
      }
      if (filters?.supplierId) {
        query = query.eq('supplier_id', filters.supplierId);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: (data ?? []).map(toProduct),
        total: count ?? 0,
        page,
        perPage,
        hasMore: (count ?? 0) > page * perPage,
      };
    } catch (e) {
      console.error('productService.getPaginated:', e);
      return { ...EMPTY, page, perPage };
    }
  },

  async getByBarcode(barcode: string): Promise<Product | null> {
    const supabase = createClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('products')
        .select(SELECT_FIELDS)
        .eq('barcode', barcode)
        .maybeSingle();
      if (error) throw error;
      return data ? toProduct(data) : null;
    } catch (e) {
      console.error('productService.getByBarcode:', e);
      return null;
    }
  },

  async getLowStock(supplierId: string, limit = 10): Promise<Product[]> {
    const supabase = createClient();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('products')
        .select(SELECT_FIELDS)
        .eq('supplier_id', supplierId)
        .in('status', ['منخفض', 'نفد'])
        .order('stock', { ascending: true })
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map(toProduct);
    } catch (e) {
      console.error('productService.getLowStock:', e);
      return [];
    }
  },
};
