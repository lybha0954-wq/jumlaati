'use client';

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

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
  status: 'pending' | 'reviewing' | 'delivering' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  buyer: { name: string; storeName: string; phone: string };
  delivery: { address: string; city: string; notes?: string };
  items: LineItem[];
  total: number;
  commission: number;
  supplierId?: string;
  retailerId?: string;
}

export interface SupplierOrder {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: 'pending' | 'ready' | 'shipped' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  customer: { name: string; storeName: string; phone: string };
  delivery: { address: string; city: string; notes?: string };
  items: LineItem[];
  total: number;
  commission?: number;
  retailerId?: string;
}

const ORDERS_COLLECTION = 'orders';

function docToIncomingOrder(id: string, data: any): IncomingOrder {
  const items: LineItem[] = (data.items || []).map((it: any, idx: number) => ({
    id: it.id || `item-${idx}`,
    name: it.name || it.productName || 'منتج',
    qty: Number(it.qty || it.quantity || 1),
    unit: it.unit || 'كرتونة',
    unitPrice: Number(it.unitPrice || it.price || 0),
  }));

  const buyer = data.buyer || data.customer || {
    name: 'صاحب محل',
    storeName: 'سوبرماركت',
    phone: '07700000000',
  };

  const delivery = data.delivery || {
    address: 'العنوان',
    city: 'بغداد',
    notes: '',
  };

  return {
    id,
    orderNumber: data.orderNumber || `ORD-${id.substring(0, 6).toUpperCase()}`,
    placedAt: data.createdAt || data.placedAt || new Date().toISOString(),
    status: data.status || 'pending',
    paymentStatus: data.paymentStatus || 'pending',
    buyer: {
      name: buyer.name || 'عميل جُمْلَتِي',
      storeName: buyer.storeName || 'المحل التجاري',
      phone: buyer.phone || '',
    },
    delivery: {
      address: delivery.address || 'العنوان الرئيسي',
      city: delivery.city || 'بغداد',
      notes: delivery.notes || '',
    },
    items,
    total: Number(data.total || 0),
    commission: Number(data.commission || (Number(data.total || 0) * 0.025)),
    supplierId: data.supplierId || '',
    retailerId: data.retailerId || '',
  };
}

export const orderService = {
  async getAll(): Promise<IncomingOrder[]> {
    try {
      const colRef = collection(db, ORDERS_COLLECTION);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map((d) => docToIncomingOrder(d.id, d.data()));
    } catch (err) {
      console.error('[orderService.getAll] Error:', err);
      return [];
    }
  },

  async getIncomingOrders(): Promise<IncomingOrder[]> {
    return this.getAll();
  },

  async getBySupplier(supplierId: string): Promise<SupplierOrder[]> {
    try {
      const colRef = collection(db, ORDERS_COLLECTION);
      const q = query(colRef, where('supplierId', '==', supplierId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => {
        const inc = docToIncomingOrder(d.id, d.data());
        return {
          id: inc.id,
          orderNumber: inc.orderNumber,
          placedAt: inc.placedAt,
          status: inc.status as any,
          paymentStatus: inc.paymentStatus,
          customer: inc.buyer,
          delivery: inc.delivery,
          items: inc.items,
          total: inc.total,
          commission: inc.commission,
          retailerId: inc.retailerId,
        };
      });
    } catch (err) {
      console.error('[orderService.getBySupplier] Error:', err);
      return [];
    }
  },

  async getByRetailer(retailerId: string): Promise<IncomingOrder[]> {
    try {
      const colRef = collection(db, ORDERS_COLLECTION);
      const q = query(colRef, where('retailerId', '==', retailerId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => docToIncomingOrder(d.id, d.data()));
    } catch (err) {
      console.error('[orderService.getByRetailer] Error:', err);
      return [];
    }
  },

  async getById(id: string): Promise<IncomingOrder | null> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return docToIncomingOrder(snapshot.id, snapshot.data());
    } catch (err) {
      console.error('[orderService.getById] Error:', err);
      return null;
    }
  },

  async create(orderData: Partial<IncomingOrder>): Promise<IncomingOrder | null> {
    try {
      const colRef = collection(db, ORDERS_COLLECTION);
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      const newDoc = {
        ...orderData,
        orderNumber: orderData.orderNumber || orderNumber,
        status: orderData.status || 'pending',
        paymentStatus: orderData.paymentStatus || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docRef = await addDoc(colRef, newDoc);
      return docToIncomingOrder(docRef.id, newDoc);
    } catch (err) {
      console.error('[orderService.create] Error:', err);
      return null;
    }
  },

  async updateStatus(id: string, status: string): Promise<boolean> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, id);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      console.error('[orderService.updateStatus] Error:', err);
      return false;
    }
  },

  async updateIncomingOrderStatus(id: string, status: string): Promise<boolean> {
    return this.updateStatus(id, status);
  },

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<boolean> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, id);
      await updateDoc(docRef, {
        paymentStatus,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      console.error('[orderService.updatePaymentStatus] Error:', err);
      return false;
    }
  },
};
