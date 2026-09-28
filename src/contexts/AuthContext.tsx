'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useUserStore } from '@/lib/stores/userStore';
import type { User } from '@/types/user';

export type UserRole = 'admin' | 'supplier' | 'retailer' | 'delivery';

interface AuthContextValue {
  user: any;
  session: any;
  loading: boolean;
  role: UserRole | null;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
  getUserProfile: () => Promise<any>;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  const supabase = isSupabaseConfigured ? createClient() : null;

  // جلب البروفايل الكامل + مزامنة مع userStore
  const fetchProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) {
        console.warn('[AuthContext] no profile for', userId);
        return;
      }

      if (data.role) setRole(data.role as UserRole);

      const storeUser: User = {
        id: data.id,
        email: data.email ?? '',
        name: data.full_name ?? data.email?.split('@')[0] ?? '',
        role: data.role as UserRole,
        phone: data.phone ?? '',
        avatar: data.avatar_url ?? undefined,
        createdAt: data.created_at ?? new Date().toISOString(),
      };
      useUserStore.getState().setUser(storeUser);
    } catch (err) {
      console.error('[AuthContext] fetchProfile error:', err);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then((res: any) => {
      const s = res?.data?.session ?? null;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_e: any, s: any) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          fetchProfile(s.user.id);
        } else {
          setRole(null);
          useUserStore.getState().setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata: Record<string, any> = {}) => {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.full_name || '',
          role: metadata.role || 'retailer',
          business_name: metadata.business_name || '',
          phone: metadata.phone || '',
          city: metadata.city || '',
          registration_number: metadata.registration_number || '',
          vehicle_type: metadata.vehicle_type || '',
        },
      },
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) await fetchProfile(data.user.id);
    return data;
  };

  const signOut = async () => {
    if (!supabase) throw new Error('Supabase is not configured');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setRole(null);
    useUserStore.getState().setUser(null);
  };

  const getCurrentUser = async () => {
    if (!supabase) return user;
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  };

  const getUserProfile = async () => {
    if (!user || !supabase) return null;
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        role,
        signUp,
        signIn,
        signOut,
        getCurrentUser,
        getUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
