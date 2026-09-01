import type { Metadata } from "next";
import { baseMetadata } from "@/config/seo";
import "../styles/globals.css"; // المسار الصحيح لمجلد styles

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
