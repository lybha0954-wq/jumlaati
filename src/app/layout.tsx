import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import { baseMetadata } from "@/config/seo";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import "../styles/globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className={`${tajawal.className} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors closeButton dir="rtl" />
        </AuthProvider>
      </body>
    </html>
  );
}
