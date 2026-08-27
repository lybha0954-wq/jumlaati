'use client';

export const COMMISSION_RATE = 0.02; // 2%
export const CURRENCY = 'د.ع';

export interface CommissionEntry {
  orderId: string;
  date: string;
  retailerName: string;
  orderTotal: number;
  commission: number;
}

export interface LedgerEntry {
  id: string;
  date: string;
  supplierId: string;
  supplierName: string;
  type: 'order' | 'payment' | 'adjustment';
  description: string;
  amount: number;
  direction: 'debit' | 'credit';
  orderId?: string;
  paymentMethod?: 'cash' | 'credit';
  status: 'completed' | 'pending' | 'overdue';
}

const COMMISSION_KEY = 'jumlaati_commissions';
const LEDGER_KEY = 'jumlaati_ledger';

// ─── Commission Store ─────────────────────────────────────────────────────────
export function getCommissions(): CommissionEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMMISSION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addCommission(entry: CommissionEntry): void {
  if (typeof window === 'undefined') return;
  const existing = getCommissions();
  existing.unshift(entry);
  localStorage.setItem(COMMISSION_KEY, JSON.stringify(existing));
}

export function getTotalCommission(): number {
  return getCommissions().reduce((s, e) => s + e.commission, 0);
}

export function getTotalSales(): number {
  return getCommissions().reduce((s, e) => s + e.orderTotal, 0);
}

// ─── Ledger Store ─────────────────────────────────────────────────────────────
export function getLedgerEntries(): LedgerEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LEDGER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addLedgerEntry(entry: LedgerEntry): void {
  if (typeof window === 'undefined') return;
  const existing = getLedgerEntries();
  existing.unshift(entry);
  localStorage.setItem(LEDGER_KEY, JSON.stringify(existing));
}

export function formatIQD(amount: number): string {
  return `${amount.toLocaleString('ar-IQ')} ${CURRENCY}`;
}
