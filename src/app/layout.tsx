import './globals.css';
export const metadata = {
  title: 'منصة جملتي التجارية',
    description: 'منصة التجارة الإلكترونية للسوق العراقي',
    };

    export default function RootLayout({
      children,
      }: {
        children: React.ReactNode;
        }) {
          return (
              <html lang="ar" dir="rtl">
                    <body className="bg-slate-950 text-slate-100 font-arabic antialiased">
                            {children}
                                  </body>
                                      </html>
                                        );
                                        }
