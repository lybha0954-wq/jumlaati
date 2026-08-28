'use client';

import { createClient } from '@/lib/supabase/client';

export interface LineItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
}

export interface IncomingOrder {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: 'reviewing' | 'delivering' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  buyer: { name: string; storeName: string; phone: string };
  delivery: { address: string; city: string; notes?: string };
  items: LineItem[];
  total: number;
  commission: number;
}

export interface SupplierOrder {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: 'pending' | 'ready' | 'shipped';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  customer: { name: string; storeName: string; phone: string };
  delivery: { address: string; city: string; notes?: string };
  items: LineItem[];
  total: number;
}

function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const cls = error.code.substring(0, 2);
    if (cls === '42' || cls === '08') return true;
    if (cls === '23') return false;
  }
  if (error.message) {
    return /relation.*does not exist|column.*does not exist|syntax error/i.test(error.message);
  }
  return false;
}

function toLineItem(row: any): LineItem {
  return { id: row.id, name: row.name, qty: row.qty, unit: row.unit, unitPrice: row.unit_price };
}

function toIncomingOrder(row: any): IncomingOrder {
  return {
    id: row.id,
    orderNumber: row.order_number,
    placedAt: row.placed_at,
    status: row.status,
    paymentStatus: row.payment_status,
    buyer: { name: row.buyer_name, storeName: row.buyer_store_name, phone: row.buyer_phone ?? '' },
    delivery: { address: row.delivery_address ?? '', city: row.delivery_city ?? '', notes: row.delivery_notes ?? '' },
    items: (row.order_items ?? []).map(toLineItem),
    total: row.total ?? 0,
    commission: row.commission ?? 0,
  };
}

function toSupplierOrder(row: any): SupplierOrder {
  return {
    id: row.id,
    orderNumber: row.order_number,
    placedAt: row.placed_at,
    status: row.status,
    paymentStatus: row.payment_status,
    customer: { name: row.customer_name, storeName: row.customer_store_name, phone: row.customer_phone ?? '' },
    delivery: { address: row.delivery_address ?? '', city: row.delivery_city ?? '', notes: row.delivery_notes ?? '' },
    items: (row.supplier_order_items ?? []).map(toLineItem),
    total: row.total ?? 0,
  };
}

export const orderService = {
  async getIncomingOrders(): Promise<IncomingOrder[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('placed_at', { ascending: false });
      if (error) { if (isSchemaError(error)) throw error; return []; }
      return (data ?? []).map(toIncomingOrder);
    } catch (e: any) { if (isSchemaError(e)) throw e; return []; }
  },

  async updateIncomingOrderStatus(id: string, status: IncomingOrder['status']): Promise<boolean> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) { if (isSchemaError(error)) throw error; return false; }
      return true;
    } catch (e: any) { if (isSchemaError(e)) throw e; return false; }
  },

  async getSupplierOrders(): Promise<SupplierOrder[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('supplier_orders')
        .select('*, supplier_order_items(*)')
        .order('placed_at', { ascending: false });
      if (error) { if (isSchemaError(error)) throw error; return []; }
      return (data ?? []).map(toSupplierOrder);
    } catch (e: any) { if (isSchemaError(e)) throw e; return []; }
  },

  async updateSupplierOrderStatus(id: string, status: SupplierOrder['status']): Promise<boolean> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('supplier_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) { if (isSchemaError(error)) throw error; return false; }
      return true;
    } catch (e: any) { if (isSchemaError(e)) throw e; return false; }
  },

  async createOrder(order: {
    orderNumber: string;
    buyerName: string;
    buyerStoreName: string;
    buyerPhone: string;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryNotes: string;
    subtotal: number;
    deliveryFee: number;
    total: number;
    commission: number;
    paymentMethod: string;
    items: Array<{ name: string; qty: number; unit: string; unitPrice: number }>;
  }): Promise<string | null> {
    const supabase = createClient();
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: order.orderNumber,
          buyer_name: order.buyerName,
          buyer_store_name: order.buyerStoreName,
          buyer_phone: order.buyerPhone,
          delivery_address: order.deliveryAddress,
          delivery_city: order.deliveryCity,
          delivery_notes: order.deliveryNotes,
          subtotal: order.subtotal,
          delivery_fee: order.deliveryFee,
          total: order.total,
          commission: order.commission,
          payment_method: order.paymentMethod,
          status: 'reviewing',
          payment_status: 'pending',
        })
        .select('id')
        .single();
      if (orderError) { if (isSchemaError(orderError)) throw orderError; return null; }
      const orderId = orderData.id;
      if (order.items.length > 0) {
        const { error: itemsError } = await supabase.from('order_items').insert(
          order.items.map((item) => ({
            order_id: orderId,
            name: item.name,
            qty: item.qty,
            unit: item.unit,
            unit_price: item.unitPrice,
          }))
        );
        if (itemsError && isSchemaError(itemsError)) throw itemsError;
      }
      return orderId;
    } catch (e: any) { if (isSchemaError(e)) throw e; return null; }
  },
};
