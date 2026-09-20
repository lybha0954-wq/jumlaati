'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

export type UserRole = 'owner' | 'admin' | 'supplier' | 'retailer' | 'delivery';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  businessName?: string;
  phone?: string;
  city?: string;
  registrationNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextValue {
  user: any;
  session: any;
  loading: boolean;
  role: UserRole | null;
  profile: UserProfile | null;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
  isEmailVerified: () => boolean;
  getUserProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

function formatUser(firebaseUser: FirebaseUser, role: UserRole | null, profile?: UserProfile | null) {
  const effectiveRole = role || profile?.role || 'retailer';
  const fullName = profile?.fullName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '';
  
  return Object.assign(firebaseUser, {
    id: firebaseUser.uid,
    user_metadata: {
      full_name: fullName,
      role: effectiveRole,
      business_name: profile?.businessName || '',
      phone: profile?.phone || '',
      city: profile?.city || '',
    },
  });
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfile;
        setProfile(data);
        if (data.role) {
          setRole(data.role);
        }
        return data;
      }
    } catch (err) {
      console.warn('[Firebase Auth] Failed to fetch profile from Firestore:', err);
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
      if (currentFirebaseUser) {
        const userProf = await fetchUserProfile(currentFirebaseUser.uid);
        const userRole = userProf?.role || 'retailer';
        const enriched = formatUser(currentFirebaseUser, userRole, userProf);
        setUser(enriched);
        setSession({ user: enriched });
      } else {
        setUser(null);
        setSession(null);
        setRole(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const userProf = await fetchUserProfile(cred.user.uid);
    const effectiveRole = userProf?.role || 'retailer';
    setRole(effectiveRole);
    const enriched = formatUser(cred.user, effectiveRole, userProf);
    setUser(enriched);
    setSession({ user: enriched });
    return { user: enriched, role: effectiveRole };
  };

  const signUp = async (email: string, password: string, metadata: Record<string, any> = {}) => {
    const cleanEmail = email.trim().toLowerCase();
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    
    const chosenRole = (metadata.role || 'retailer') as UserRole;
    const fullName = metadata.fullName || metadata.full_name || '';
    const businessName = metadata.businessName || metadata.business_name || '';
    const phone = metadata.phone || '';
    const city = metadata.city || 'بغداد';
    const registrationNumber = metadata.registrationNumber || metadata.registration_number || '';

    if (fullName) {
      try {
        await firebaseUpdateProfile(cred.user, { displayName: fullName });
      } catch (e) {
        console.warn('Could not update Firebase displayName:', e);
      }
    }

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: cleanEmail,
      role: chosenRole,
      fullName,
      businessName,
      phone,
      city,
      registrationNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    } catch (e) {
      console.warn('[Firebase Auth] Failed to save profile to Firestore:', e);
    }

    setRole(chosenRole);
    setProfile(newProfile);
    const enriched = formatUser(cred.user, chosenRole, newProfile);
    setUser(enriched);
    setSession({ user: enriched });
    return { user: enriched, role: chosenRole };
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setSession(null);
    setRole(null);
    setProfile(null);
  };

  const getCurrentUser = async () => {
    return auth.currentUser ? formatUser(auth.currentUser, role, profile) : null;
  };

  const isEmailVerified = () => {
    return auth.currentUser?.emailVerified ?? false;
  };

  const getUserProfile = async () => {
    if (!auth.currentUser) return null;
    return await fetchUserProfile(auth.currentUser.uid);
  };

  const value: AuthContextValue = {
    user,
    session,
    loading,
    role,
    profile,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    isEmailVerified,
    getUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
