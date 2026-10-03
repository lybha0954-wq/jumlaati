import type { Metadata, Viewport } from "next";
import { WebVitalsReporter } from "@/components/shared/WebVitalsReporter";
import { Tajawal } from "next/font/google";
import { baseMetadata } from "@/config/seo";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

import { ServiceWorkerRegister } from "@/components/shared/ServiceWorkerRegister";
import { RouteProgress } from "@/components/shared/RouteProgress";
import dynamic from "next/dynamic";

const InstallPrompt = dynamic(
  () => import("@/components/shared/InstallPrompt").then((m) => m.InstallPrompt)
);
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
    <html lang="ar" dir="rtl" className={tajawal.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("jumlati-theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${tajawal.className} antialiased`}>
        <AuthProvider>
          <RouteProgress />
          <WebVitalsReporter />
          {children}
          <InstallPrompt />
          <ServiceWorkerRegister />
          <Toaster position="top-center" richColors closeButton dir="rtl" />
        </AuthProvider>
      </body>
    </html>
  );
}
