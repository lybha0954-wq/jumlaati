'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export type UserRole = 'owner' | 'admin' | 'supplier' | 'retailer' | 'delivery';

interface AuthContextValue {
  user: any;
  session: any;
  loading: boolean;
  role: UserRole | null;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
  isEmailVerified: () => boolean;
  getUserProfile: () => Promise<any>;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  const supabase = isSupabaseConfigured ? createClient() : null;

  const fetchRole = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      if (!error && data?.role) {
        setRole(data.role as UserRole);
      }
    } catch {
      // silently ignore
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata: Record<string, any> = {}) => {
    if (!supabase) throw new Error('Supabase is not configured');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.fullName || metadata.full_name || '',
          role: metadata.role || 'retailer',
          avatar_url: metadata.avatarUrl || '',
          business_name: metadata.business_name || '',
          phone: metadata.phone || '',
          city: metadata.city || '',
          registration_number: metadata.registration_number || '',
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
    if (data.user) {
      await fetchRole(data.user.id);
    }
    return data;
  };

  const signOut = async () => {
    if (!supabase) throw new Error('Supabase is not configured');

    if (role === 'admin' && typeof window !== 'undefined') {
      localStorage.setItem('jumlaati_admin_was_logged_out', 'true');
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setRole(null);
  };

  const getCurrentUser = async () => {
    if (!supabase) return user;
    const { data: { user: u }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return u;
  };

  const isEmailVerified = () => {
    return user?.email_confirmed_at !== null;
  };

  const getUserProfile = async () => {
    if (!user) return null;
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  };

  const value: AuthContextValue = {
    user,
    session,
    loading,
    role,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    isEmailVerified,
    getUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
