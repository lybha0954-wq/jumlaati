import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { baseMetadata } from "@/config/seo";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
