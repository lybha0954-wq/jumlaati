'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNavBar from './BottomNavBar';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  activeRoute?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex bg-background min-h-screen" dir="rtl">
      <div className="hidden lg:block flex-shrink-0">
        <div className="fixed top-0 right-0 h-full z-50">
          <Sidebar />
        </div>
        <div className="w-60" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} role={role || undefined} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 pb-24 lg:pb-6">
            {children}
          </div>
        </main>
      </div>

      <BottomNavBar />
    </div>
  );
}
