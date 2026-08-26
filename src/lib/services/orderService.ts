import { supabase } from '@/lib/supabase/client';

export interface LineItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  unit?: string;
}

export interface IncomingOrder {
  id: string;
  orderNumber: string;
  retailerId: string;
  retailerName?: string;
  retailerPhone?: string;
  supplierId?: string;
  status: 'pending' | 'reviewing' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: LineItem[];
  totalAmount: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  deliveryAddress?: string;
  placedAt: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  buyer: {
    name: string;
    storeName: string;
    phone: string;
  };
  delivery: {
    city: string;
    address: string;
    notes?: string;
  };
}

export interface SupplierOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName?: string;
  retailerId?: string;
  status: 'pending' | 'reviewing' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: LineItem[];
  totalAmount: number;
  notes?: string;
  createdAt?: string;
}

function mapOrder(o: Record<string, unknown>): IncomingOrder {
  const items = Array.isArray(o.order_items)
    ? (o.order_items as Record<string, unknown>[]).map((i) => ({
        id: String(i.id ?? ''),
        productId: String(i.product_id ?? ''),
        productName: String(i.product_name ?? i.name ?? ''),
        quantity: Number(i.quantity ?? i.qty ?? 0),
        unitPrice: Number(i.unit_price ?? i.price ?? 0),
        total: Number(i.total ?? Number(i.quantity ?? 0) * Number(i.unit_price ?? 0)),
        unit: i.unit ? String(i.unit) : undefined,
      }))
    : [];

  return {
    id: String(o.id ?? ''),
    orderNumber: String(o.order_number ?? o.id ?? ''),
    retailerId: String(o.retailer_id ?? o.buyer_id ?? ''),
    retailerName: o.retailer_name ? String(o.retailer_name) : undefined,
    retailerPhone: o.retailer_phone ? String(o.retailer_phone) : undefined,
    supplierId: o.supplier_id ? String(o.supplier_id) : undefined,
    status: (o.status as IncomingOrder['status']) ?? 'pending',
    items,
    totalAmount: Number(o.total_amount ?? o.total ?? o.subtotal ?? 0),
    notes: o.notes ? String(o.notes) : undefined,
    createdAt: o.created_at ? String(o.created_at) : undefined,
    updatedAt: o.updated_at ? String(o.updated_at) : undefined,
    deliveryAddress: o.delivery_address ? String(o.delivery_address) : undefined,
    placedAt: String(o.created_at ?? o.placed_at ?? new Date().toISOString()),
    paymentStatus: (o.payment_status as IncomingOrder['paymentStatus']) ?? 'pending',
    buyer: {
      name: String(o.buyer_name ?? o.retailer_name ?? ''),
      storeName: String(o.buyer_store_name ?? o.store_name ?? ''),
      phone: String(o.buyer_phone ?? o.retailer_phone ?? ''),
    },
    delivery: {
      city: String(o.delivery_city ?? ''),
      address: String(o.delivery_address ?? ''),
      notes: o.delivery_notes ? String(o.delivery_notes) : undefined,
    },
  };
}

export const orderService = {
  async getIncomingOrders(): Promise<IncomingOrder[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapOrder);
    } catch {
      return [];
    }
  },

  async getSupplierOrders(): Promise<SupplierOrder[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((o) => ({
        ...mapOrder(o),
        supplierId: String(o.supplier_id ?? ''),
        supplierName: o.supplier_name ? String(o.supplier_name) : undefined,
      })) as SupplierOrder[];
    } catch {
      return [];
    }
  },

  async getOrderById(id: string): Promise<IncomingOrder | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data ? mapOrder(data) : null;
    } catch {
      return null;
    }
  },

  async updateOrderStatus(id: string, status: IncomingOrder['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async updateIncomingOrderStatus(id: string, status: IncomingOrder['status']): Promise<boolean> {
    return orderService.updateOrderStatus(id, status);
  },

  async createOrder(order: Partial<IncomingOrder>): Promise<IncomingOrder | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          retailer_id: order.retailerId,
          supplier_id: order.supplierId,
          status: order.status ?? 'pending',
          total_amount: order.totalAmount ?? 0,
          notes: order.notes,
          delivery_address: order.deliveryAddress,
        })
        .select()
        .single();
      if (error) throw error;
      return data ? mapOrder(data) : null;
    } catch {
      return null;
    }
  },
};
