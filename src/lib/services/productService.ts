'use client';

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  costPrice: number;
  originalPrice: number;
  finalPrice: number;
  discountPercentage?: number;
  discountPrice?: number;
  isOnOffer?: boolean;
  offerStartDate?: string;
  offerEndDate?: string;
  stock: number;
  minOrderQty: number;
  status: 'متوفر' | 'منخفض' | 'نفد' | 'موقوف';
  unit: string;
  supplierId?: string;
  supplierName?: string;
  supplierRating?: number;
  deliveryDays?: number;
  createdAt?: string;
}

function docToProduct(id: string, data: any): Product {
  const stock = Number(data.stock ?? 0);
  let status: Product['status'] = data.status || 'متوفر';
  if (stock <= 0) status = 'نفد';
  else if (stock < 10) status = 'منخفض';

  return {
    id,
    barcode: data.barcode ?? '',
    name: data.name ?? data.product_name ?? '',
    category: data.category ?? 'أغذية عامة',
    costPrice: Number(data.costPrice ?? data.cost_price ?? 0),
    originalPrice: Number(data.originalPrice ?? data.original_price ?? 0),
    finalPrice: Number(data.finalPrice ?? data.final_price ?? data.originalPrice ?? 0),
    discountPercentage: Number(data.discountPercentage ?? data.discount_percentage ?? 0),
    discountPrice: Number(data.discountPrice ?? data.discount_price ?? 0),
    isOnOffer: Boolean(data.isOnOffer ?? data.is_on_offer ?? false),
    offerStartDate: data.offerStartDate ?? data.offer_start_date ?? undefined,
    offerEndDate: data.offerEndDate ?? data.offer_end_date ?? undefined,
    stock,
    minOrderQty: Number(data.minOrderQty ?? data.min_order_qty ?? 1),
    status,
    unit: data.unit ?? 'كرتونة',
    supplierId: data.supplierId ?? data.supplier_id ?? '',
    supplierName: data.supplierName ?? data.supplier_name ?? 'مورد جُمْلَتِي',
    supplierRating: Number(data.supplierRating ?? data.supplier_rating ?? 4.8),
    deliveryDays: Number(data.deliveryDays ?? data.delivery_days ?? 1),
    createdAt: data.createdAt ?? undefined,
  };
}

const PRODUCTS_COLLECTION = 'products';

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map((d) => docToProduct(d.id, d.data()));
    } catch (err) {
      console.error('[productService.getAll] Error fetching products:', err);
      return [];
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return docToProduct(snapshot.id, snapshot.data());
    } catch (err) {
      console.error('[productService.getById] Error:', err);
      return null;
    }
  },

  async getBySupplier(supplierId: string): Promise<Product[]> {
    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(colRef, where('supplierId', '==', supplierId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => docToProduct(d.id, d.data()));
    } catch (err) {
      console.error('[productService.getBySupplier] Error:', err);
      return [];
    }
  },

  async getByCategory(category: string): Promise<Product[]> {
    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(colRef, where('category', '==', category));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => docToProduct(d.id, d.data()));
    } catch (err) {
      console.error('[productService.getByCategory] Error:', err);
      return [];
    }
  },

  async getByBarcode(barcode: string): Promise<Product | null> {
    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(colRef, where('barcode', '==', barcode), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const d = snapshot.docs[0];
      return docToProduct(d.id, d.data());
    } catch (err) {
      console.error('[productService.getByBarcode] Error:', err);
      return null;
    }
  },

  async getActiveOffers(): Promise<Product[]> {
    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(colRef, where('isOnOffer', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => docToProduct(d.id, d.data()));
    } catch (err) {
      console.error('[productService.getActiveOffers] Error:', err);
      return [];
    }
  },

  async create(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      const newDoc = {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docRef = await addDoc(colRef, newDoc);
      return docToProduct(docRef.id, newDoc);
    } catch (err) {
      console.error('[productService.create] Error creating product:', err);
      return null;
    }
  },

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const patch = {
        ...product,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(docRef, patch);
      return await this.getById(id);
    } catch (err) {
      console.error('[productService.update] Error updating product:', err);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error('[productService.delete] Error deleting product:', err);
      return false;
    }
  },
};
