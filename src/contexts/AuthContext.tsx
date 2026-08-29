'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '../lib/supabase/client';

// ⚠️ التعديل الأول: إضافة دور التوصيل delivery إلى النوع
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

// ─── Mock auth store (used when Supabase is not configured) ───────────────────
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

// ─── AuthProvider ─────────────────────────────────────────────────────────────
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
        return;
      }
      // Fallback: read role from user metadata
      const { data: { user: u } } = await supabase.auth.getUser();
      if (u?.user_metadata?.role) {
        setRole(u.user_metadata.role as UserRole);
      }
    } catch {
      // silently ignore
    }
  };

  useEffect(() => {
    if (!supabase) {
      // Mock: restore session from localStorage
      const mockSession = getMockSession();
      if (mockSession) {
        setUser(mockSession.user);
        setSession(mockSession);
        setRole(mockSession.user?.user_metadata?.role || null);
      }
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

  // ── Sign Up ──────────────────────────────────────────────────────────────────
  const signUp = async (email: string, password: string, metadata: Record<string, any> = {}) => {
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
          role: metadata.role || 'retailer', // يدعم delivery الآن
          business_name: metadata.business_name || '',
          phone: metadata.phone || '',
          city: metadata.city || '',
          governorate: metadata.governorate || '',
          vehicle_type: metadata.vehicle_type || '', // حقل جديد
        },
      };
      users[email] = { ...mockUser, password };
      saveMockUsers(users);
      // Auto-create session so subsequent signIn works immediately
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
          avatar_url: metadata.avatarUrl || '',
          business_name: metadata.business_name || '',
          phone: metadata.phone || '',
          city: metadata.city || '',
          governorate: metadata.governorate || '',
          vehicle_type: metadata.vehicle_type || '',
          registration_number: metadata.registration_number || '',
        },
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  // ── Sign In ──────────────────────────────────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      // Mock sign-in
      const users = getMockUsers();
      const found = users[email];
      if (!found || found.password !== password) throw new Error('Invalid login credentials');
      const mockSession = { user: found, access_token: 'mock-token' };
      saveMockSession(mockSession);
      setUser(found);
      setSession(mockSession);
      setRole(found.user_metadata?.role || 'retailer');
      return { user: found, session: mockSession };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      // Set role from metadata immediately for fast redirect
      const metaRole = data.user.user_metadata?.role as UserRole | undefined;
      if (metaRole) setRole(metaRole);
      // Also fetch from user_profiles (may override)
      await fetchRole(data.user.id);
    }
    return data;
  };

  // ── Sign Out ─────────────────────────────────────────────────────────────────
  const signOut = async () => {
    if (!supabase) {
      // If current user is admin, mark that admin has signed out
      const currentRole = user?.user_metadata?.role;
      if (currentRole === 'admin') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('jumlaati_admin_was_logged_out', 'true');
        }
      }
      saveMockSession(null);
      setUser(null);
      setSession(null);
      setRole(null);
      return;
    }
    // For real Supabase: check role before signing out
    const currentRole = user?.user_metadata?.role;
    if (currentRole === 'admin' && typeof window !== 'undefined') {
      localStorage.setItem('jumlaati_admin_was_logged_out', 'true');
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setRole(null);
  };

  // ── Get Current User ─────────────────────────────────────────────────────────
  const getCurrentUser = async () => {
    if (!supabase) return user;
    const { data: { user: u }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return u;
  };

  // ── Email Verified ───────────────────────────────────────────────────────────
  const isEmailVerified = () => {
    return user?.email_confirmed_at !== null;
  };

  // ── Get User Profile ─────────────────────────────────────────────────────────
  const getUserProfile = async () => {
    if (!user) return null;
    if (!supabase) return user?.user_metadata || null;
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
