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

    const metaRole = user?.user_metadata?.role;
    const finalRole = metaRole || role;

    switch (finalRole) {
      case 'admin': router.replace('/admin/dashboard'); break;
      case 'supplier': router.replace('/supplier/dashboard'); break;
      case 'delivery': router.replace('/delivery/tasks'); break;
      default: router.replace('/retailer/home'); break;
    }
  }, [user, role, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
