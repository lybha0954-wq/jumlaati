'use client';

import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export interface CommissionEntry {
  id: string;
  orderId: string;
  orderDate: string;
  retailerName: string;
  orderTotal: number;
  commission: number;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  entryDate: string;
  supplierId: string;
  supplierName: string;
  entryType: 'order' | 'payment' | 'adjustment';
  description: string;
  amount: number;
  direction: 'debit' | 'credit';
  balance: number;
  orderId?: string;
  paymentMethod?: string;
  status: 'completed' | 'pending' | 'overdue';
}

export const financialService = {
  async getCommissions(): Promise<CommissionEntry[]> {
    try {
      const ordersRef = collection(db, 'orders');
      const snapshot = await getDocs(ordersRef);
      return snapshot.docs.map((d) => {
        const data = d.data();
        const total = Number(data.total || 0);
        const commission = Number(data.commission || total * 0.025);
        return {
          id: d.id,
          orderId: data.orderNumber || d.id,
          orderDate: data.createdAt || new Date().toISOString(),
          retailerName: data.buyer?.name || data.customer?.name || 'محل تجاري',
          orderTotal: total,
          commission,
          createdAt: data.createdAt || new Date().toISOString(),
        };
      });
    } catch (err) {
      console.error('[financialService.getCommissions] Error:', err);
      return [];
    }
  },

  async getLedgerEntries(retailerId?: string): Promise<LedgerEntry[]> {
    try {
      const ordersRef = collection(db, 'orders');
      let q = query(ordersRef);
      if (retailerId) {
        q = query(ordersRef, where('retailerId', '==', retailerId));
      }
      const snapshot = await getDocs(q);
      let runningBalance = 0;

      return snapshot.docs.map((d) => {
        const data = d.data();
        const total = Number(data.total || 0);
        runningBalance += total;
        return {
          id: d.id,
          entryDate: data.createdAt || new Date().toISOString(),
          supplierId: data.supplierId || '',
          supplierName: data.supplierName || 'مورد جُمْلَتِي',
          entryType: 'order',
          description: `طلب بضاعة رقم ${data.orderNumber || d.id.slice(0, 6)}`,
          amount: total,
          direction: 'debit',
          balance: runningBalance,
          orderId: d.id,
          paymentMethod: data.paymentStatus === 'paid' ? 'نقدي' : 'آجل',
          status: data.paymentStatus || 'pending',
        };
      });
    } catch (err) {
      console.error('[financialService.getLedgerEntries] Error:', err);
      return [];
    }
  },

  async recordPayment(entry: Partial<LedgerEntry>): Promise<boolean> {
    try {
      const ledgerRef = collection(db, 'ledger');
      await addDoc(ledgerRef, {
        ...entry,
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      console.error('[financialService.recordPayment] Error:', err);
      return false;
    }
  },

  async getTotals(): Promise<{ totalCommission: number; totalSales: number; totalOrders: number }> {
    try {
      const ordersRef = collection(db, 'orders');
      const snapshot = await getDocs(ordersRef);
      let totalSales = 0;
      let totalCommission = 0;

      snapshot.docs.forEach((docSnap) => {
        const d = docSnap.data();
        const t = Number(d.total || 0);
        totalSales += t;
        totalCommission += Number(d.commission || t * 0.025);
      });

      return {
        totalSales,
        totalCommission,
        totalOrders: snapshot.docs.length,
      };
    } catch (err) {
      console.error('[financialService.getTotals] Error:', err);
      return { totalCommission: 0, totalSales: 0, totalOrders: 0 };
    }
  },
};
