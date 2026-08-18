'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
        const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

          const { user, loading } = useAuth();
            const router = useRouter();
              const pathname = usePathname();

                const resolvedRoute = activeRoute ?? pathname ?? '/';

                  // التوجيه عند عدم تسجيل الدخول
                    useEffect(() => {
                        if (!loading && !user) {
                              router.replace('/sign-up-login');
                                  }
                                    }, [user, loading, router]);

                                      // إغلاق القائمة الجانبية للموبايل عند تغيير الصفحة
                                        useEffect(() => {
                                            setMobileMenuOpen(false);
                                              }, [pathname]);

                                                const toggleSidebar = useCallback(() => {
                                                    setSidebarCollapsed((prev) => !prev);
                                                      }, []);

                                                        const toggleMobileMenu = useCallback(() => {
                                                            setMobileMenuOpen((prev) => !prev);
                                                              }, []);

                                                                // شاشة التحميل أثناء فحص الحساب
                                                                  if (loading) {
                                                                      return (
                                                                            <div className="flex items-center justify-center min-h-[100dvh] bg-background" dir="rtl">
                                                                                    <div className="flex flex-col items-center gap-3">
                                                                                              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                                                                                        <p className="font-arabic text-muted-foreground text-xs sm:text-sm font-medium animate-pulse">
                                                                                                                    جاري التحميل وتجهيز البيانات...
                                                                                                                              </p>
                                                                                                                                      </div>
                                                                                                                                            </div>
                                                                                                                                                );
                                                                                                                                                  }

                                                                                                                                                    if (!user) return null;

                                                                                                                                                      return (
                                                                                                                                                          <div className="flex min-h-[100dvh] bg-background text-foreground" dir="rtl">
                                                                                                                                                                {/* Sidebar — Desktop Only (lg+) */}
                                                                                                                                                                      <aside className="hidden lg:block flex-shrink-0">
                                                                                                                                                                              <div
                                                                                                                                                                                        className={`fixed top-0 right-0 h-full z-40 transition-all duration-300 ease-in-out ${
                                                                                                                                                                                                    sidebarCollapsed ? 'w-16' : 'w-60'
                                                                                                                                                                                                              }`}
                                                                                                                                                                                                                      >
                                                                                                                                                                                                                                <Sidebar
                                                                                                                                                                                                                                            collapsed={sidebarCollapsed}
                                                                                                                                                                                                                                                        onToggleCollapse={toggleSidebar}
                                                                                                                                                                                                                                                                    activeRoute={resolvedRoute}
                                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                              {/* Placeholder Space Reserve */}
                                                                                                                                                                                                                                                                                                      <div
                                                                                                                                                                                                                                                                                                                className={`transition-all duration-300 ease-in-out ${
                                                                                                                                                                                                                                                                                                                            sidebarCollapsed ? 'w-16' : 'w-60'
                                                                                                                                                                                                                                                                                                                                      }`}
                                                                                                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                                                                                                                    </aside>

                                                                                                                                                                                                                                                                                                                                                          {/* Main Layout Area */}
                                                                                                                                                                                                                                                                                                                                                                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                                                                                                                                                                                                                                                                                                                                                                        {/* Top Header */}
                                                                                                                                                                                                                                                                                                                                                                                <Topbar onMobileMenuToggle={toggleMobileMenu} />

                                                                                                                                                                                                                                                                                                                                                                                        {/* Main Scrollable Content */}
                                                                                                                                                                                                                                                                                                                                                                                                <main className="flex-1 overflow-y-auto overflow-x-hidden focus:outline-none" tabIndex={-1}>
                                                                                                                                                                                                                                                                                                                                                                                                          <div className="max-w-screen-2xl mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 py-4 sm:py-6 pb-24 lg:pb-8">
                                                                                                                                                                                                                                                                                                                                                                                                                      {children}
                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                        </main>
                                                                                                                                                                                                                                                                                                                                                                                                                                              </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                    {/* Bottom Navigation Bar — Mobile/Tablet Only */}
                                                                                                                                                                                                                                                                                                                                                                                                                                                          <BottomNavBar />
                                                                                                                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                