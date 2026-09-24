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
      router.replace('/login');
      return;
    }

    // أولوية: role من user_metadata (يُحفظ عند التسجيل)
    const metaRole = user?.user_metadata?.role;
    const finalRole = metaRole || role;

    console.log('Redirecting user with role:', finalRole);

    switch (finalRole) {
      case 'admin':
        router.replace('/admin/dashboard');
        break;
      case 'supplier':
        router.replace('/supplier/dashboard');
        break;
      case 'delivery':
        router.replace('/delivery/tasks');
        break;
      case 'retailer':
      default:
        router.replace('/retailer/home');
        break;
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
