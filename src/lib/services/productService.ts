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
  discountPercentage?: number;
  discountPrice?: number;
  isOnOffer?: boolean;
  offerStartDate?: string;
  offerEndDate?: string;
  stock: number;
  minOrderQty: number;
  status: 'متوفر' | 'منخفض' | 'نفد' | 'موقوف';
  unit: string;
  supplierId?: string;
  supplierName?: string;
  supplierRating?: number;
  deliveryDays?: number;
}

function toProduct(row: any): Product {
  return {
    id: row.id,
    barcode: row.barcode ?? '',
    name: row.product_name ?? row.name,
    category: row.category ?? '',
    costPrice: row.cost_price ?? 0,
    originalPrice: row.original_price ?? 0,
    finalPrice: row.final_price ?? 0,
    discountPercentage: row.discount_percentage ?? 0,
    discountPrice: row.discount_price ?? 0,
    isOnOffer: row.is_on_offer ?? false,
    offerStartDate: row.offer_start_date ?? undefined,
    offerEndDate: row.offer_end_date ?? undefined,
    stock: row.stock ?? 0,
    minOrderQty: row.min_order_qty ?? 1,
    status: row.status as Product['status'],
    unit: row.unit ?? 'قطعة',
    supplierId: row.supplier_id ?? '',
    supplierName: row.supplier_name ?? '',
    supplierRating: row.supplier_rating ?? 4.5,
    deliveryDays: row.delivery_days ?? 1,
  };
}

function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const cls = error.code.substring(0, 2);
    if (cls === '42' || cls === '08') return true;
    if (cls === '23') return false;
  }
  if (error.message) {
    return /relation.*does not exist|column.*does not exist|function.*does not exist|syntax error/i.test(error.message);
  }
  return false;
}

export const productService = {
  async getAll(): Promise<Product[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data ?? []).map(toProduct);
    } catch (e: any) {
      if (isSchemaError(e)) throw e;
      return [];
    }
  },

  async getByBarcode(barcode: string): Promise<Product | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .rpc('get_product_by_barcode', { barcode_value: barcode });
      if (error) { if (isSchemaError(error)) throw error; return null; }
      if (!data || (Array.isArray(data) && data.length === 0)) return null;
      const row = Array.isArray(data) ? data[0] : data;
      return toProduct(row);
    } catch (e: any) { if (isSchemaError(e)) throw e; return null; }
  },

  async getActiveOffers(): Promise<Product[]> {
    const supabase = createClient();
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_on_offer', true)
        .lte('offer_start_date', now)
        .gte('offer_end_date', now)
        .order('created_at', { ascending: false });
      if (error) { if (isSchemaError(error)) throw error; return []; }
      return (data ?? []).map(toProduct);
    } catch (e: any) { if (isSchemaError(e)) throw e; return []; }
  },

  async create(product: Omit<Product, 'id'>): Promise<Product | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          barcode: product.barcode,
          name: product.name,
          category: product.category,
          cost_price: product.costPrice,
          original_price: product.originalPrice,
          final_price: product.finalPrice,
          discount_percentage: product.discountPercentage ?? 0,
          discount_price: product.discountPrice ?? 0,
          is_on_offer: product.isOnOffer ?? false,
          offer_start_date: product.offerStartDate ?? null,
          offer_end_date: product.offerEndDate ?? null,
          stock: product.stock,
          min_order_qty: product.minOrderQty,
          status: product.status,
          unit: product.unit,
          supplier_id: product.supplierId || null,
          supplier_name: product.supplierName || '',
          supplier_rating: product.supplierRating ?? 4.5,
          delivery_days: product.deliveryDays ?? 1,
        })
        .select()
        .single();
      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return toProduct(data);
    } catch (e: any) {
      if (isSchemaError(e)) throw e;
      return null;
    }
  },

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const supabase = createClient();
    const patch: any = {};
    if (product.barcode !== undefined) patch.barcode = product.barcode;
    if (product.name !== undefined) patch.name = product.name;
    if (product.category !== undefined) patch.category = product.category;
    if (product.costPrice !== undefined) patch.cost_price = product.costPrice;
    if (product.originalPrice !== undefined) patch.original_price = product.originalPrice;
    if (product.finalPrice !== undefined) patch.final_price = product.finalPrice;
    if (product.discountPercentage !== undefined) patch.discount_percentage = product.discountPercentage;
    if (product.discountPrice !== undefined) patch.discount_price = product.discountPrice;
    if (product.isOnOffer !== undefined) patch.is_on_offer = product.isOnOffer;
    if (product.offerStartDate !== undefined) patch.offer_start_date = product.offerStartDate;
    if (product.offerEndDate !== undefined) patch.offer_end_date = product.offerEndDate;
    if (product.stock !== undefined) patch.stock = product.stock;
    if (product.minOrderQty !== undefined) patch.min_order_qty = product.minOrderQty;
    if (product.status !== undefined) patch.status = product.status;
    if (product.unit !== undefined) patch.unit = product.unit;
    if (product.supplierId !== undefined) patch.supplier_id = product.supplierId || null;
    if (product.supplierName !== undefined) patch.supplier_name = product.supplierName;
    patch.updated_at = new Date().toISOString();
    try {
      const { data, error } = await supabase
        .from('products')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return toProduct(data);
    } catch (e: any) {
      if (isSchemaError(e)) throw e;
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        if (isSchemaError(error)) throw error;
        return false;
      }
      return true;
    } catch (e: any) {
      if (isSchemaError(e)) throw e;
      return false;
    }
  },
};
