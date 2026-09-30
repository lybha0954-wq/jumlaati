import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import { baseMetadata } from "@/config/seo";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { InstallPrompt } from "@/components/shared/InstallPrompt";
import { ServiceWorkerRegister } from "@/components/shared/ServiceWorkerRegister";
import "../styles/globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  ...baseMetadata,
  applicationName: "جُمْلَتِي",
  appleWebApp: {
    capable: true,
    title: "جُمْلَتِي",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#2e8b73",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
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
          <InstallPrompt />
          <ServiceWorkerRegister />
          <Toaster position="top-center" richColors closeButton dir="rtl" />
        </AuthProvider>
      </body>
    </html>
  );
}
