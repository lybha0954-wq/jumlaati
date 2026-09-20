'use client';

import { collection, doc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export interface Store {
  id: string;
  name: string;
  owner: string;
  phone: string;
  city: string;
  status: 'active' | 'pending' | 'suspended';
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  creditLimit: number;
}

export const storeService = {
  async getAll(): Promise<Store[]> {
    try {
      const colRef = collection(db, 'users');
      const q = query(colRef, where('role', '==', 'retailer'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.businessName || 'محل تجاري',
          owner: data.fullName || 'صاحب المحل',
          phone: data.phone || '',
          city: data.city || 'بغداد',
          status: 'active',
          joinDate: data.createdAt ? data.createdAt.substring(0, 10) : new Date().toISOString().substring(0, 10),
          totalOrders: Number(data.totalOrders || 0),
          totalSpent: Number(data.totalSpent || 0),
          creditLimit: Number(data.creditLimit || 2000000),
        };
      });
    } catch (e: any) {
      console.error('[storeService.getAll] Error:', e);
      return [];
    }
  },

  async updateStatus(id: string, status: Store['status']): Promise<boolean> {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (e: any) {
      console.error('[storeService.updateStatus] Error:', e);
      return false;
    }
  },
};
