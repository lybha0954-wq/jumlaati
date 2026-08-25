import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = { title: 'منصة جملتي التجارية', description: 'منصة الجملة والتجزئة في العراق' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-950 text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
