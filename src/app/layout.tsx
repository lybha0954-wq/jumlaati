import type { Metadata, Viewport } from 'next';
import '@/styles/tailwind.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'جُمْلَتِي — منصة توريد البقالة بالجملة في العراق',
  description:
    'جُمْلَتِي تربط أصحاب المحلات بتجار الجملة في العراق لطلب البضاعة بسهولة.',
  icons: { icon: [{ url: '/favicon.ico', type: 'image/x-icon' }] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-arabic">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="bottom-left" toastOptions={{ style: { fontFamily: 'Tajawal, sans-serif', direction: 'rtl' } }} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
