'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNavBar from './BottomNavBar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  activeRoute?: string;
}

export default function AppLayout({ children, activeRoute }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const resolvedRoute = activeRoute ?? pathname ?? '/';

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/sign-up-login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-arabic text-muted-foreground text-sm">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex bg-background" style={{ minHeight: '100dvh' }} dir="rtl">
      {/* Sidebar — desktop only (lg+) */}
      <div className="hidden lg:block flex-shrink-0">
        <div
          className={`fixed top-0 right-0 h-full z-50 sidebar-transition ${sidebarCollapsed ? 'w-16' : 'w-60'}`}
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            activeRoute={resolvedRoute}
          />
        </div>
        <div className={`sidebar-transition ${sidebarCollapsed ? 'w-16' : 'w-60'}`} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky top header */}
        <Topbar onMobileMenuToggle={() => {}} />

        {/* Scrollable content — padded bottom to clear fixed bottom nav on mobile */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 lg:py-6 pb-24 lg:pb-6">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar — mobile only (fixed, z-40 below modals) */}
      <BottomNavBar />
    </div>
  );
}