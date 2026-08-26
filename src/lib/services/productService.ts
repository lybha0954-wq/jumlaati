import { supabase } from '@/lib/supabase/client';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  barcode?: string;
  image?: string;
  supplierId?: string;
  supplierName?: string;
  unit?: string;
  minOrder?: number;
  minOrderQty?: number;
  isActive?: boolean;
  status?: string;
  finalPrice?: number;
  originalPrice?: number;
  costPrice?: number;
  createdAt?: string;
}

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.final_price ?? p.price ?? 0,
        stock: p.stock ?? p.stock_quantity ?? 0,
        category: p.category,
        barcode: p.barcode,
        image: p.image_url ?? p.image,
        supplierId: p.supplier_id,
        supplierName: p.supplier_name,
        unit: p.unit,
        minOrder: p.min_order_qty ?? p.min_order_quantity ?? p.min_order,
        minOrderQty: p.min_order_qty ?? p.min_order_quantity ?? p.min_order ?? 1,
        isActive: p.is_active ?? true,
        status: p.status,
        costPrice: p.cost_price ?? 0,
        finalPrice: p.final_price ?? 0,
        originalPrice: p.cost_price ?? 0,
        createdAt: p.created_at,
      }));
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) return null;
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.final_price ?? data.price ?? 0,
        stock: data.stock ?? data.stock_quantity ?? 0,
        category: data.category,
        barcode: data.barcode,
        image: data.image_url ?? data.image,
        supplierId: data.supplier_id,
        supplierName: data.supplier_name,
        unit: data.unit,
        minOrder: data.min_order_qty ?? data.min_order_quantity ?? data.min_order,
        minOrderQty: data.min_order_qty ?? data.min_order_quantity ?? data.min_order ?? 1,
        isActive: data.is_active ?? true,
        status: data.status,
        costPrice: data.cost_price ?? 0,
        finalPrice: data.final_price ?? 0,
        originalPrice: data.cost_price ?? 0,
        createdAt: data.created_at,
      };
    } catch {
      return null;
    }
  },

  async create(product: Partial<Product>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          stock_quantity: product.stock,
          category: product.category,
          barcode: product.barcode,
          image_url: product.image,
          supplier_id: product.supplierId,
          unit: product.unit,
          min_order_quantity: product.minOrder,
          is_active: product.isActive ?? true,
        })
        .select()
        .single();
      if (error) throw error;
      return data ? { ...product, id: data.id, createdAt: data.created_at } as Product : null;
    } catch {
      return null;
    }
  },

  async update(id: string, product: Partial<Product>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          stock_quantity: product.stock,
          category: product.category,
          barcode: product.barcode,
          image_url: product.image,
          unit: product.unit,
          min_order_quantity: product.minOrder,
          is_active: product.isActive,
        })
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },
};
