'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RootPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router?.replace('/sign-up-login');
      return;
    }
    if (role === 'retailer') {
      router?.replace('/retailer-home');
    } else if (role === 'supplier') {
      router?.replace('/supplier-dashboard');
    } else if (role === 'admin') {
      router?.replace('/admin-hub');
    } else {
      router?.replace('/retailer-home');
    }
  }, [user, role, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-arabic text-muted-foreground text-sm">جاري التحميل...</p>
      </div>
    </div>
  );
}