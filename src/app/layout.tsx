import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { baseMetadata } from "@/config/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
