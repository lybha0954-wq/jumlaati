import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/tailwind.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/components/ui/Toast';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'جُمْلَتِي — تطبيق التوريد والتجارة الأول في العراق',
  description: 'تطبيق جملتي الأول في العراق لخدمة التجارة — يربط أصحاب السوبرماركت ومحلات الجملة ومندوبي التوصيل في منصة واحدة متكاملة.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={plusJakartaSans.variable}>
      <body className={`${plusJakartaSans.className} font-arabic`}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              fontFamily: 'Tajawal, sans-serif',
              direction: 'rtl',
            },
          }}
        />
      </body>
    </html>
  );
}
