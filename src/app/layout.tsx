import type { Metadata, Viewport } from 'next';
import '@/styles/tailwind.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'جُمْلَتِي — منصة توريد البقالة بالجملة في العراق',
  description: 'جُمْلَتِي تربط أصحاب المحلات بتجار الجملة في العراق.',
  icons: { icon: [{ url: '/favicon.ico', type: 'image/x-icon' }] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-arabic">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster
                position="bottom-left"
                toastOptions={{
                  style: { fontFamily: 'Tajawal, sans-serif', direction: 'rtl' },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
