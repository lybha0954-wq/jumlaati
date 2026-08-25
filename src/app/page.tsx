'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push('/login'); }
    else {
      if (profile?.role === 'admin') router.push('/admin/panel');
      else if (profile?.role === 'supplier') router.push('/supplier/dashboard');
      else if (profile?.role === 'retailer') router.push('/retailer/browse');
      else if (profile?.role === 'courier') router.push('/courier/dashboard');
      else router.push('/login');
    }
  }, [user, profile, loading, router]);

  return <div className="min-h-screen flex items-center justify-center text-slate-500">جاري التحميل...</div>;
}
