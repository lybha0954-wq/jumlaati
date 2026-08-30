'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { createClient, isSupabaseConfigured } from '../lib/supabase/client';
import { useRouter } from 'next/navigation';

// تعريف الأدوار الأربعة بشكل صريح
export type UserRole = 'admin' | 'supplier' | 'retailer' | 'delivery';

interface AuthContextValue {
  user: any;
  session: any;
  loading: boolean;
  role: UserRole | null;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  signIn: (identifier: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
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

// ─── Mock auth store (يستخدم فقط إذا لم يتم ربط Supabase) ────
const MOCK_USERS_KEY = 'jumlaati_mock_users';
const MOCK_SESSION_KEY = 'jumlaati_mock_session';

function getMockUsers(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '{}'); } catch { return {}; }
}
function saveMockUsers(users: Record<string, any>) {
  if (typeof window !== 'undefined') localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}
function getMockSession(): any {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(MOCK_SESSION_KEY) || 'null'); } catch { return null; }
}
function saveMockSession(session: any) {
  if (typeof window !== 'undefined') localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const router = useRouter();

  const supabase = isSupabaseConfigured ? createClient() : null;

  // جلب الدور من قاعدة البيانات أو من البيانات الوصفية
  const fetchRole = useCallback(async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      if (!error && data?.role) {
        setRole(data.role as UserRole);
        return;
      }
      // Fallback: قراءة الدور من بيانات المستخدم
      const { data: { user: u } } = await supabase.auth.getUser();
      if (u?.user_metadata?.role) {
        setRole(u.user_metadata.role as UserRole);
      }
    } catch {
      // تجاهل الأخطاء الصامتة
    }
  }, [supabase]);

  // تهيئة الجلسة
  useEffect(() => {
    if (!supabase) {
      // وضع المحاكاة (Mock)
      const mockSession = getMockSession();
      if (mockSession) {
        setUser(mockSession.user);
        setSession(mockSession);
        setRole(mockSession.user?.user_metadata?.role || null);
      }
      setLoading(false);
      return;
    }

    // الوضع الحقيقي
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
  }, [supabase, fetchRole]);

  // تسجيل حساب جديد (مع دعم الدور الجديد delivery)
  const signUp = useCallback(async (email: string, password: string, metadata: Record<string, any> = {}) => {
    if (!supabase) {
      // Mock sign-up
      const users = getMockUsers();
      if (users[email]) throw new Error('User already registered');
      const mockUser = {
        id: `mock-${Date.now()}`,
        email,
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {
          full_name: metadata.full_name || metadata.fullName || '',
          role: metadata.role || 'retailer',
          business_name: metadata.business_name || '',
          phone: metadata.phone || '',
          governorate: metadata.governorate || '',
          vehicle_type: metadata.vehicle_type || '', // حقل جديد
        },
      };
      users[email] = { ...mockUser, password };
      saveMockUsers(users);
      const mockSession = { user: mockUser, access_token: 'mock-token' };
      saveMockSession(mockSession);
      setUser(mockUser);
      setSession(mockSession);
      setRole((mockUser.user_metadata.role as UserRole) || 'retailer');
      return { user: mockUser, session: mockSession };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.fullName || metadata.full_name || '',
          role: metadata.role || 'retailer',
          business_name: metadata.business_name || '',
          phone: metadata.phone || '',
          governorate: metadata.governorate || '',
          vehicle_type: metadata.vehicle_type || '',
        },
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  }, [supabase]);

  // تسجيل الدخول (البريد أو الهاتف)
  const signIn = useCallback(async (identifier: string, password: string) => {
    if (!supabase) {
      // Mock sign-in
      const users = getMockUsers();
      const found = users[identifier];
      if (!found || found.password !== password) throw new Error('Invalid login credentials');
      const mockSession = { user: found, access_token: 'mock-token' };
      saveMockSession(mockSession);
      setUser(found);
      setSession(mockSession);
      setRole(found.user_metadata?.role || 'retailer');
      return { user: found, session: mockSession };
    }

    // دعم تسجيل الدخول بالهاتف أو البريد
    const { data, error } = await supabase.auth.signInWithPassword({ email: identifier, password });
    if (error) throw error;
    if (data.user) {
      const metaRole = data.user.user_metadata?.role as UserRole | undefined;
      if (metaRole) setRole(metaRole);
      await fetchRole(data.user.id);
    }
    return data;
  }, [supabase, fetchRole]);

  // تسجيل الخروج
  const signOut = useCallback(async () => {
    if (!supabase) {
      saveMockSession(null);
      setUser(null);
      setSession(null);
      setRole(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setRole(null);
  }, [supabase]);

  // جلب الملف الشخصي
  const getUserProfile = useCallback(async () => {
    if (!user) return null;
    if (!supabase) return user?.user_metadata || null;
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  }, [supabase, user]);

  // استخدام useMemo لتحسين الأداء ومنع إعادة التصيير غير الضرورية
  const value = useMemo(() => ({
    user,
    session,
    loading,
    role,
    signUp,
    signIn,
    signOut,
    getUserProfile,
  }), [user, session, loading, role, signUp, signIn, signOut, getUserProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
