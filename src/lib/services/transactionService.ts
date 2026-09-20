'use client';

import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

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

const TRANSACTIONS_COLLECTION = 'transactions';

function docToTransaction(id: string, data: any): Transaction {
  return {
    id,
    transactionNumber: data.transactionNumber || `TRX-${id.slice(0, 6).toUpperCase()}`,
    retailerId: data.retailerId,
    supplierId: data.supplierId,
    orderId: data.orderId,
    invoiceId: data.invoiceId,
    totalAmount: Number(data.totalAmount || 0),
    paidAmount: Number(data.paidAmount || 0),
    remainingAmount: Number(data.remainingAmount || 0),
    currency: data.currency || 'IQD',
    paymentStatus: data.paymentStatus || 'pending',
    paymentMethod: data.paymentMethod || 'cash',
    dueDate: data.dueDate,
    paidAt: data.paidAt,
    notes: data.notes || '',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    try {
      const colRef = collection(db, TRANSACTIONS_COLLECTION);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map((d) => docToTransaction(d.id, d.data()));
    } catch (e) {
      console.error('[transactionService.getAll] Error:', e);
      return [];
    }
  },

  async getByRetailer(retailerId: string): Promise<Transaction[]> {
    try {
      const colRef = collection(db, TRANSACTIONS_COLLECTION);
      const q = query(colRef, where('retailerId', '==', retailerId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => docToTransaction(d.id, d.data()));
    } catch (e) {
      console.error('[transactionService.getByRetailer] Error:', e);
      return [];
    }
  },

  async getBySupplier(supplierId: string): Promise<Transaction[]> {
    try {
      const colRef = collection(db, TRANSACTIONS_COLLECTION);
      const q = query(colRef, where('supplierId', '==', supplierId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => docToTransaction(d.id, d.data()));
    } catch (e) {
      console.error('[transactionService.getBySupplier] Error:', e);
      return [];
    }
  },

  async create(trx: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const colRef = collection(db, TRANSACTIONS_COLLECTION);
      const newDoc = {
        ...trx,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docRef = await addDoc(colRef, newDoc);
      return docToTransaction(docRef.id, newDoc);
    } catch (e) {
      console.error('[transactionService.create] Error:', e);
      return null;
    }
  },
};
