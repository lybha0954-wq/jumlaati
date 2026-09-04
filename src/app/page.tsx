

import { RequestCard } from "@/components/shared/RequestCard";
import { productService } from "@/lib/services/productService";
import { Store, Handshake, Truck, ShieldCheck, ArrowLeft, Users, Package } from "lucide-react";

export default async function Home() {
  let products = [];
  try {
    products = await productService.getAllProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <PublicHeader />

      {/* القسم البطل (Hero) - أزرق داكن مع ذهبي */}
      <section className="relative overflow-hidden bg-[#0F172A] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#312E81] opacity-90" />
        <div className="container relative z-10 mx-auto px-4 py-28 text-center">
          <span className="inline-block mb-6 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b]">
            منصة الجملة والتجزئة في العراق
          </span>
          <h1 className="mx-auto mb-6 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
            نظام تجاري متكامل لـ <span className="text-[#f59e0b]">جُمْلَتِي</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-300">
            عالم مصغر وآمن يربط تاجر الجملة بتاجر التجزئة ومندوب التوصيل، بعلاقة تجارية واضحة ومباشرة بدون وسطاء.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-[#f59e0b] text-gray-900 hover:bg-[#d97706] h-12 px-8">
              ابدأ التسوق
            </Button>
            <Button size="lg" variant="outline" className="border-slate-400 text-white hover:bg-white/10 h-12 px-8">
              سجّل كتاجر جملة
            </Button>
          </div>
        </div>
        {/* موجات سفلية (اختياري لجمالية أكثر) */}
        <svg className="absolute bottom-0 left-0 w-full text-[#F8FAFC]" viewBox="0 0 1440 100" fill="none">
          <path d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 45C1200 30 1320 15 1380 10L1440 5V100H0V50Z" fill="currentColor"></path>
        </svg>
      </section>

      {/* قسم إحصائيات المنصة (لملء الفراغ) */}
      <section className="container mx-auto -mt-10 px-4 relative z-20">
        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-8 shadow-xl border border-gray-100 md:grid-cols-4">
          <div className="text-center"><h4 className="text-3xl font-black text-[#1E3A8A]">+500</h4><p className="text-sm text-gray-500 mt-1">تاجر نشط</p></div>
          <div className="text-center"><h4 className="text-3xl font-black text-[#1E3A8A]">+1200</h4><p className="text-sm text-gray-500 mt-1">طلب شهري</p></div>
          <div className="text-center"><h4 className="text-3xl font-black text-[#1E3A8A]">18</h4><p className="text-sm text-gray-500 mt-1">محافظة مغطاة</p></div>
          <div className="text-center"><h4 className="text-3xl font-black text-[#1E3A8A]">98%</h4><p className="text-sm text-gray-500 mt-1">نسبة رضا</p></div>
        </div>
      </section>

      {/* كيف تعمل المنصة - تصميم متنفس */}
      <section className="container mx-auto py-20 px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">آلية عمل المنصة</h2>
          <p className="text-gray-500 text-lg">علاقة تجارية واضحة بثلاثة أطراف</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="group rounded-3xl border border-gray-100 bg-white p-8 hover:shadow-lg transition-all">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E3A8A]/10 text-[#1E3A8A]">
              <Store size={32} strokeWidth={1.5} />
            </div>
            <h3 className="mb-3 text-xl font-bold">تاجر الجملة</h3>
            <p className="leading-relaxed text-gray-600">يضيف كتالوجه بأسعار جملة حقيقية، ويقبل تجار التجزئة كشركاء ثقة.</p>
          </div>
          
          <div className="group rounded-3xl border border-gray-100 bg-white p-8 hover:shadow-lg transition-all">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f59e0b]/10 text-[#d97706]">
              <Handshake size={32} strokeWidth={1.5} />
            </div>
            <h3 className="mb-3 text-xl font-bold">تاجر التجزئة</h3>
            <p className="leading-relaxed text-gray-600">يلتحق بأكثر من جملة، ويطلب احتياجاته بسلة منفصلة لكل مورد.</p>
          </div>

          <div className="group rounded-3xl border border-gray-100 bg-white p-8 hover:shadow-lg transition-all">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#059669]">
              <Truck size={32} strokeWidth={1.5} />
            </div>
            <h3 className="mb-3 text-xl font-bold">مندوب التوصيل</h3>
            <p className="leading-relaxed text-gray-600">يرتبط بالجملة لتوصيل الطلبات بأمان، مع نظام أرباح واضح.</p>
          </div>
        </div>
      </section>

      {/* أحدث المنتجات */}
      <section className="container mx-auto pb-20 px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-extrabold">أحدث المنتجات</h2>
          <button className="flex items-center gap-2 text-[#1E3A8A] hover:underline">عرض الكل <ArrowLeft size={18} /></button>
        </div>
        
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
            <Package className="mb-4 text-gray-300" size={48} />
            <h3 className="text-xl font-bold text-gray-500">لا توجد منتجات بعد</h3>
            <p className="mt-2 text-gray-400">قم بإضافة أول منتج من لوحة تحكم تاجر الجملة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <RequestCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* لماذا جُمْلَتِي - بساطة واحترافية */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">لماذا جُمْلَتِي؟</h2>
            <p className="text-gray-500">نمنح التجار علاقة مباشرة وشفافة</p>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A]">
                <ShieldCheck size={28} />
              </div>
              <h4 className="mb-2 font-bold">بيئة مغلقة</h4>
              <p className="text-sm text-gray-500">لا يرى التجار إلا شركاءهم المرتبطين فقط.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f59e0b]/10 text-[#d97706]">
                <Handshake size={28} />
              </div>
              <h4 className="mb-2 font-bold">شفافية</h4>
              <p className="text-sm text-gray-500">أسعار جملة حقيقية وتكاليف واضحة.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/10 text-[#059669]">
                <Users size={28} />
              </div>
              <h4 className="mb-2 font-bold">مجتمع تجاري</h4>
              <p className="text-sm text-gray-500">شبكة تجار ومندوبين بعلاقات دائمة.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Truck size={28} />
              </div>
              <h4 className="mb-2 font-bold">توصيل متكامل</h4>
              <p className="text-sm text-gray-500">مندوبون مرتبطون مباشرة بالمورد.</p>
            </div>
          </div>
        </div>
      </section>

      {/* دعوة للتسجيل */}
      <section className="bg-[#0F172A] py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-black text-white">ابدأ بناء عالمك التجاري الآن</h2>
          <Button size="lg" className="bg-[#f59e0b] text-gray-900 hover:bg-[#d97706]">انضم إلى جُمْلَتِي</Button>
        </div>
      </section>
    </main>
  );
}
