'use client';

import { createClient } from '@/lib/supabase/client';

export interface Transaction {
  id: string;
  transactionNumber: string;
  retailerId?: string;
  supplierId?: string;
  orderId?: string;
  invoiceId?: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: string;
  paymentStatus: 'paid' | 'partial' | 'pending' | 'overdue' | 'cancelled';
  paymentMethod: 'cod' | 'bank_transfer' | 'cash' | 'credit';
  dueDate?: string;
  paidAt?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
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

function toTransaction(row: any): Transaction {
  return {
    id: row.id,
    transactionNumber: row.transaction_number,
    retailerId: row.retailer_id ?? undefined,
    supplierId: row.supplier_id ?? undefined,
    orderId: row.order_id ?? undefined,
    invoiceId: row.invoice_id ?? undefined,
    totalAmount: row.total_amount ?? 0,
    paidAmount: row.paid_amount ?? 0,
    remainingAmount: row.remaining_amount ?? 0,
    currency: row.currency ?? 'IQD',
    paymentStatus: row.payment_status as Transaction['paymentStatus'],
    paymentMethod: row.payment_method as Transaction['paymentMethod'],
    dueDate: row.due_date ?? undefined,
    paidAt: row.paid_at ?? undefined,
    notes: row.notes ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) { if (isSchemaError(error)) throw error; return []; }
      return (data ?? []).map(toTransaction);
    } catch (e: any) { if (isSchemaError(e)) throw e; return []; }
  },

  async getByRetailer(retailerId: string): Promise<Transaction[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('retailer_id', retailerId)
        .order('created_at', { ascending: false });
      if (error) { if (isSchemaError(error)) throw error; return []; }
      return (data ?? []).map(toTransaction);
    } catch (e: any) { if (isSchemaError(e)) throw e; return []; }
  },

  async getBySupplier(supplierId: string): Promise<Transaction[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false });
      if (error) { if (isSchemaError(error)) throw error; return []; }
      return (data ?? []).map(toTransaction);
    } catch (e: any) { if (isSchemaError(e)) throw e; return []; }
  },

  async create(tx: Omit<Transaction, 'id' | 'remainingAmount' | 'createdAt' | 'updatedAt'>): Promise<Transaction | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          transaction_number: tx.transactionNumber,
          retailer_id: tx.retailerId ?? null,
          supplier_id: tx.supplierId ?? null,
          order_id: tx.orderId ?? null,
          invoice_id: tx.invoiceId ?? null,
          total_amount: tx.totalAmount,
          paid_amount: tx.paidAmount,
          currency: tx.currency ?? 'IQD',
          payment_status: tx.paymentStatus,
          payment_method: tx.paymentMethod,
          due_date: tx.dueDate ?? null,
          paid_at: tx.paidAt ?? null,
          notes: tx.notes ?? '',
        })
        .select()
        .single();
      if (error) { if (isSchemaError(error)) throw error; return null; }
      return toTransaction(data);
    } catch (e: any) { if (isSchemaError(e)) throw e; return null; }
  },

  async updatePayment(id: string, paidAmount: number, paymentStatus: Transaction['paymentStatus']): Promise<boolean> {
    const supabase = createClient();
    try {
      const patch: any = {
        paid_amount: paidAmount,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      };
      if (paymentStatus === 'paid') {
        patch.paid_at = new Date().toISOString();
      }
      const { error } = await supabase
        .from('transactions')
        .update(patch)
        .eq('id', id);
      if (error) { if (isSchemaError(error)) throw error; return false; }
      return true;
    } catch (e: any) { if (isSchemaError(e)) throw e; return false; }
  },

  async getDebtSummary(userId: string): Promise<{ totalDebt: number; overdueDebt: number; pendingDebt: number }> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('remaining_amount, payment_status')
        .or(`retailer_id.eq.${userId},supplier_id.eq.${userId}`)
        .neq('payment_status', 'paid')
        .neq('payment_status', 'cancelled');
      if (error) { if (isSchemaError(error)) throw error; return { totalDebt: 0, overdueDebt: 0, pendingDebt: 0 }; }
      const rows = data ?? [];
      return {
        totalDebt: rows.reduce((s: number, r: any) => s + (r.remaining_amount ?? 0), 0),
        overdueDebt: rows.filter((r: any) => r.payment_status === 'overdue').reduce((s: number, r: any) => s + (r.remaining_amount ?? 0), 0),
        pendingDebt: rows.filter((r: any) => r.payment_status === 'pending' || r.payment_status === 'partial').reduce((s: number, r: any) => s + (r.remaining_amount ?? 0), 0),
      };
    } catch (e: any) { if (isSchemaError(e)) throw e; return { totalDebt: 0, overdueDebt: 0, pendingDebt: 0 }; }
  },
};
