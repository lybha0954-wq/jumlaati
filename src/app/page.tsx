export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 text-slate-900">
      
      {/* القسم العلوي (Hero) */}
      <section className="bg-[#0F172A] text-white py-24 text-center">
        <h1 className="text-5xl font-black mb-6">جُمْلَتِي</h1>
        <p className="text-lg text-gray-300 mb-10">منصة عراقية متكاملة للبيع بالجملة والتجزئة.</p>
        <div className="flex justify-center gap-4">
          <button className="bg-[#f59e0b] text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-[#d97706] transition-colors">
            تصفح المتجر
          </button>
          <button className="border border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
            إنشاء حساب
          </button>
        </div>
      </section>

      {/* قسم المزايا البسيطة */}
      <section className="container mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="font-bold text-xl mb-2">تاجر جملة</h2>
          <p className="text-gray-600">أضف منتجاتك وتواصل مع التجار مباشرة.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="font-bold text-xl mb-2">تاجر تجزئة</h2>
          <p className="text-gray-600">اطلب احتياجاتك بأفضل أسعار الجملة.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="font-bold text-xl mb-2">مندوب توصيل</h2>
          <p className="text-gray-600">وصّل الطلبات بأمان واحصل على أرباحك.</p>
        </div>
      </section>

      {/* قسم المنتجات (قابل للتعديل لاحقاً) */}
      <section className="container mx-auto pb-16 px-4">
        <h2 className="text-2xl font-bold mb-6">أحدث المنتجات</h2>
        <div className="bg-white p-10 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl">
          لا توجد منتجات بعد. قم بإضافة أول منتج من لوحة التحكم.
        </div>
      </section>

    </main>
  );
}
