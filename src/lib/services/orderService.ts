'use client';

import { createClient } from '@/lib/supabase/client';

export interface OrderSummary {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: string;
  paymentStatus: string;
  total: number;
  buyerName: string;
  buyerStoreName: string;
  buyerPhone: string;
  deliveryCity: string;
  itemsCount: number;
}

export interface PaginatedOrders {
  data: OrderSummary[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

const SELECT_FIELDS =
  'id, order_number, placed_at, status, payment_status, total, buyer_name, buyer_store_name, buyer_phone, delivery_city, order_items(id)';

function toSummary(row: any): OrderSummary {
  return {
    id: row.id,
    orderNumber: row.order_number ?? '',
    placedAt: row.placed_at ?? '',
    status: row.status ?? '',
    paymentStatus: row.payment_status ?? '',
    total: row.total ?? 0,
    buyerName: row.buyer_name ?? '',
    buyerStoreName: row.buyer_store_name ?? '',
    buyerPhone: row.buyer_phone ?? '',
    deliveryCity: row.delivery_city ?? '',
    itemsCount: row.order_items?.length ?? 0,
  };
}

const EMPTY: PaginatedOrders = {
  data: [],
  total: 0,
  page: 1,
  perPage: 20,
  hasMore: false,
};

export const orderService = {
  async getRetailerOrders(
    retailerId: string,
    page = 1,
    perPage = 20
  ): Promise<PaginatedOrders> {
    const supabase = createClient();
    if (!supabase) return { ...EMPTY, page, perPage };

    try {
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const { data, error, count } = await supabase
        .from('orders')
        .select(SELECT_FIELDS, { count: 'exact' })
        .eq('retailer_id', retailerId)
        .order('placed_at', { ascending: false })
        .range(from, to);
      if (error) throw error;

      return {
        data: (data ?? []).map(toSummary),
        total: count ?? 0,
        page,
        perPage,
        hasMore: (count ?? 0) > page * perPage,
      };
    } catch (e) {
      console.error('orderService.getRetailerOrders:', e);
      return { ...EMPTY, page, perPage };
    }
  },

  async getSupplierOrders(
    supplierId: string,
    page = 1,
    perPage = 20
  ): Promise<PaginatedOrders> {
    const supabase = createClient();
    if (!supabase) return { ...EMPTY, page, perPage };

    try {
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const { data, error, count } = await supabase
        .from('orders')
        .select(SELECT_FIELDS, { count: 'exact' })
        .eq('supplier_id', supplierId)
        .order('placed_at', { ascending: false })
        .range(from, to);
      if (error) throw error;

      return {
        data: (data ?? []).map(toSummary),
        total: count ?? 0,
        page,
        perPage,
        hasMore: (count ?? 0) > page * perPage,
      };
    } catch (e) {
      console.error('orderService.getSupplierOrders:', e);
      return { ...EMPTY, page, perPage };
    }
  },

  async updateStatus(orderId: string, status: string): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('orderService.updateStatus:', e);
      return false;
    }
  },
};
