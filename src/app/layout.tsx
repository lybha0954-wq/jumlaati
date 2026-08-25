import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = { title: 'منصة جملتي التجارية', description: 'منصة الجملة والتجزئة في العراق' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-950 text-white">
        <AuthProvider>{children}</AuthProvider>

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fjumlaati1280back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></body>
    </html>
  );
}
