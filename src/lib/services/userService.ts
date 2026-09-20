'use client';

import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { UserProfile, UserRole } from '@/contexts/AuthContext';

const USERS_COLLECTION = 'users';

export const userService = {
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const colRef = collection(db, USERS_COLLECTION);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map((d) => ({
        uid: d.id,
        ...d.data(),
      } as UserProfile));
    } catch (err) {
      console.error('[userService.getAllUsers] Error:', err);
      return [];
    }
  },

  async getUsersByRole(role: UserRole): Promise<UserProfile[]> {
    try {
      const colRef = collection(db, USERS_COLLECTION);
      const q = query(colRef, where('role', '==', role));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        uid: d.id,
        ...d.data(),
      } as UserProfile));
    } catch (err) {
      console.error('[userService.getUsersByRole] Error:', err);
      return [];
    }
  },

  async getUserById(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return {
        uid: snapshot.id,
        ...snapshot.data(),
      } as UserProfile;
    } catch (err) {
      console.error('[userService.getUserById] Error:', err);
      return null;
    }
  },

  async updateUser(uid: string, patch: Partial<UserProfile>): Promise<boolean> {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      await updateDoc(docRef, {
        ...patch,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      console.error('[userService.updateUser] Error:', err);
      return false;
    }
  },

  async updateUserRole(uid: string, role: any): Promise<boolean> {
    return this.updateUser(uid, { role });
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    return this.getUserById(uid);
  },

  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<boolean> {
    return this.updateUser(uid, data);
  },

  async deleteUser(uid: string): Promise<boolean> {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error('[userService.deleteUser] Error:', err);
      return false;
    }
  },
};
