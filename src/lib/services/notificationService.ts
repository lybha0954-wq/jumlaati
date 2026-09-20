'use client';

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export interface AppNotificationDB {
  id: string;
  userId: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  type: 'order' | 'invoice' | 'stock' | 'system';
  isRead: boolean;
  linkUrl: string;
  roleTarget: 'admin' | 'supplier' | 'retailer' | 'all';
  data?: Record<string, any>;
  createdAt: string;
}

const NOTIFS_COLLECTION = 'notifications';

function docToNotification(id: string, data: any): AppNotificationDB {
  return {
    id,
    userId: data.userId || data.user_id || '',
    titleAr: data.titleAr || data.title_ar || data.title || '',
    titleEn: data.titleEn || data.title_en || '',
    messageAr: data.messageAr || data.message_ar || data.message || '',
    messageEn: data.messageEn || data.message_en || '',
    type: data.type || 'system',
    isRead: Boolean(data.isRead ?? data.is_read ?? false),
    linkUrl: data.linkUrl || data.link_url || '',
    roleTarget: data.roleTarget || data.role_target || 'all',
    data: data.data || undefined,
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
  };
}

export const notificationService = {
  async getForUser(userId: string): Promise<AppNotificationDB[]> {
    try {
      const colRef = collection(db, NOTIFS_COLLECTION);
      const q = query(colRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => docToNotification(d.id, d.data()));
    } catch (err) {
      console.error('[notificationService.getForUser] Error:', err);
      return [];
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const colRef = collection(db, NOTIFS_COLLECTION);
      const q = query(colRef, where('userId', '==', userId), where('isRead', '==', false));
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (err) {
      console.error('[notificationService.getUnreadCount] Error:', err);
      return 0;
    }
  },

  async markAsRead(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, NOTIFS_COLLECTION, id);
      await updateDoc(docRef, { isRead: true });
      return true;
    } catch (err) {
      console.error('[notificationService.markAsRead] Error:', err);
      return false;
    }
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const colRef = collection(db, NOTIFS_COLLECTION);
      const q = query(colRef, where('userId', '==', userId), where('isRead', '==', false));
      const snapshot = await getDocs(q);
      const updates = snapshot.docs.map((d) => updateDoc(doc(db, NOTIFS_COLLECTION, d.id), { isRead: true }));
      await Promise.all(updates);
      return true;
    } catch (err) {
      console.error('[notificationService.markAllAsRead] Error:', err);
      return false;
    }
  },

  async create(notification: Omit<AppNotificationDB, 'id' | 'createdAt'>): Promise<AppNotificationDB | null> {
    try {
      const colRef = collection(db, NOTIFS_COLLECTION);
      const newDoc = {
        ...notification,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(colRef, newDoc);
      return docToNotification(docRef.id, newDoc);
    } catch (err) {
      console.error('[notificationService.create] Error:', err);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, NOTIFS_COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error('[notificationService.delete] Error:', err);
      return false;
    }
  },
};
