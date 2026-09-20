'use client';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export interface Supplier {
  id: string;
  name: string;
  region: string;
  rating: number;
  phone: string;
  isActive: boolean;
  creditLimit: number;
  creditUsed: number;
  pendingDebt: number;
  dueDays: number;
  creditStatus: 'good' | 'warning' | 'overdue';
}

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    try {
      const colRef = collection(db, 'users');
      const q = query(colRef, where('role', '==', 'supplier'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.businessName || data.fullName || 'مورد جُمْلَتِي',
          region: data.city || 'بغداد',
          rating: Number(data.rating || 4.8),
          phone: data.phone || '',
          isActive: true,
          creditLimit: Number(data.creditLimit || 5000000),
          creditUsed: Number(data.creditUsed || 0),
          pendingDebt: Number(data.pendingDebt || 0),
          dueDays: Number(data.dueDays || 30),
          creditStatus: 'good',
        };
      });
    } catch (e: any) {
      console.error('[supplierService.getAll] Error:', e);
      return [];
    }
  },
};
