import { supabase } from '@/lib/supabase/client';

export interface LedgerEntry {
  id: string;
  type: 'credit' | 'debit' | 'payment';
  amount: number;
  description?: string;
  supplierId?: string;
  supplierName?: string;
  retailerId?: string;
  orderId?: string;
  orderNumber?: string;
  date?: string;
  createdAt?: string;
  balance?: number;
  paymentMethod?: string;
  status?: string;
}

export interface FinancialTotals {
  totalCommission: number;
  totalSales: number;
  totalOrders: number;
}

function mapLedger(t: Record<string, unknown>): LedgerEntry {
  return {
    id: String(t.id ?? ''),
    type: (t.type as LedgerEntry['type']) ?? 'debit',
    amount: Number(t.amount ?? t.total_amount ?? 0),
    description: t.description ? String(t.description) : undefined,
    supplierId: t.supplier_id ? String(t.supplier_id) : undefined,
    supplierName: t.supplier_name ? String(t.supplier_name) : undefined,
    retailerId: t.retailer_id ? String(t.retailer_id) : undefined,
    orderId: t.order_id ? String(t.order_id) : undefined,
    orderNumber: t.order_number ? String(t.order_number) : undefined,
    date: t.date ? String(t.date) : t.created_at ? String(t.created_at) : undefined,
    createdAt: t.created_at ? String(t.created_at) : undefined,
    balance: t.balance ? Number(t.balance) : undefined,
    paymentMethod: t.payment_method ? String(t.payment_method) : undefined,
    status: t.payment_status ? String(t.payment_status) : undefined,
  };
}

export const financialService = {
  async getTotals(): Promise<FinancialTotals> {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total_amount, status');
      if (error) throw error;

      const delivered = (orders || []).filter((o) => o.status === 'delivered');
      const totalSales = delivered.reduce((sum, o) => sum + Number(o.total_amount ?? 0), 0);
      const totalCommission = Math.round(totalSales * 0.05);
      const totalOrders = (orders || []).length;

      return { totalCommission, totalSales, totalOrders };
    } catch {
      return { totalCommission: 0, totalSales: 0, totalOrders: 0 };
    }
  },

  async getLedger(retailerId?: string): Promise<LedgerEntry[]> {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (retailerId) {
        query = query.eq('retailer_id', retailerId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapLedger);
    } catch {
      return [];
    }
  },

  async getSupplierLedger(supplierId?: string): Promise<LedgerEntry[]> {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (supplierId) {
        query = query.eq('supplier_id', supplierId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapLedger);
    } catch {
      return [];
    }
  },

  async recordPayment(entry: Partial<LedgerEntry>): Promise<boolean> {
    try {
      const { error } = await supabase.from('transactions').insert({
        type: entry.type ?? 'payment',
        amount: entry.amount,
        description: entry.description,
        supplier_id: entry.supplierId,
        retailer_id: entry.retailerId,
        order_id: entry.orderId,
        payment_method: entry.paymentMethod,
        payment_status: entry.status ?? 'paid',
      });
      return !error;
    } catch {
      return false;
    }
  },
};
