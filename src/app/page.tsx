import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { RequestCard } from "@/components/shared/RequestCard";
import { productService } from "@/lib/services/productService";
import { ArrowLeft, Store, Handshake, Truck, ShieldCheck, Users, LayoutGrid } from "lucide-react";

export default async function Home() {
  let products = [];
  try {
    products = await productService.getAllProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F9FAFB]">
      <Topbar />

      {/* 1. القسم البطل (Hero Section) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="container mx-auto px-4 py-24 text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-sm px-4 py-1 rounded-full mb-6 backdrop-blur-sm">
            المنصة العراقية الأولى للبيع بالجملة والتجزئة
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            اربط تجارتك مع <span className="text-[#34D399]">جملا</span>
          </h1>
          <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto text-white/90">
            عالم تجاري مصغّر وآمن، يربط تجار الجملة بتجار التجزئة ومندوبي التوصيل في جميع أنحاء العراق.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="bg-[#34D399] text-gray-900 hover:bg-[#6EE7B7]">
              ابدأ التسوق الآن
            </Button>
            <Button variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10">
              انضم كتاجر جملة
            </Button>
          </div>
        </div>
      </section>

      {/* 2. قسم كيف تعمل المنصة؟ (How It Works) */}
      <section className="container mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">كيف تعمل منصة جملا؟</h2>
          <p className="text-gray-500 mt-4 text-lg">ثلاث خطوات بسيطة لبناء علاقة تجارية ناجحة</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Store className="text-[#1E3A8A]" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">تاجر الجملة يضيف منتجاته</h3>
            <p className="text-gray-600 leading-relaxed">يقوم تاجر الجملة بنشر كتالوجه بأسعار الجملة الحقيقية ليشاهدها التجار المرتبطون به فقط.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="h-14 w-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <Handshake className="text-[#059669]" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">تاجر التجزئة يطلب ويشتري</h3>
            <p className="text-gray-600 leading-relaxed">بعد إرسال طلب انضمام وقبول الجملة له، يبدأ التاجر بطلباته مباشرة بتقسيم سلة منفصلة لكل جملة.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Truck className="text-[#6D28D9]" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">مندوب التوصيل يوصل الطلب</h3>
            <p className="text-gray-600 leading-relaxed">يستلم المندوب طلبات التجار ويوصلها بأمان، مع نظام أرباح ووظائف واضحة لكل عملية.</p>
          </div>
        </div>
      </section>

      {/* 3. قسم أحدث المنتجات (Featured Products) */}
      <section className="container mx-auto pb-20 px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">أحدث المنتجات</h2>
          <Button variant="ghost">
            عرض الكل <ArrowLeft size={18} className="mr-1" />
          </Button>
        </div>
        
        {/* شرط عدم وجود منتجات كما طلبت */}
        {products.length === 0 ? (
          <div className="col-span-4 text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <LayoutGrid className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-500">لا توجد منتجات بعد</h3>
            <p className="text-gray-400 mt-2">قم بإضافة أول منتج من لوحة تحكم تاجر الجملة ليظهر هنا</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <RequestCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. قسم لماذا جملا؟ (Features) */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">لماذا تختار جملا؟</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-14 w-14 mx-auto bg-[#1E3A8A]/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="text-[#1E3A8A]" size={28} />
              </div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">ثقة وحماية</h4>
              <p className="text-gray-500 text-sm">بيئة مغلقة وآمنة لا يرى فيها التجار إلا من يرتبطون معهم.</p>
            </div>
            <div className="text-center">
              <div className="h-14 w-14 mx-auto bg-[#34D399]/10 rounded-full flex items-center justify-center mb-4">
                <Truck className="text-[#059669]" size={28} />
              </div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">توصيل موثوق</h4>
              <p className="text-gray-500 text-sm">شبكة مندوبي توصيل مرتبطون مباشرة بتجار الجملة لضمان سرعة التسليم.</p>
            </div>
            <div className="text-center">
              <div className="h-14 w-14 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="text-[#6D28D9]" size={28} />
              </div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">شبكة تجارية متكاملة</h4>
              <p className="text-gray-500 text-sm">جملة، تجزئة، وتوصيل في نظام واحد مترابط وشفاف.</p>
            </div>
            <div className="text-center">
              <div className="h-14 w-14 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Handshake className="text-orange-600" size={28} />
              </div>
              <h4 className="font-bold text-lg text-gray-800 mb-2">أسعار جملة حقيقية</h4>
              <p className="text-gray-500 text-sm">اربح أكثر بشراء مباشر من المورد بدون وسطاء وبتكلفة أقل.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. قسم انضم الآن (CTA) + Footer */}
      <section className="bg-[#1E3A8A] py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">جاهز لبناء عالمك التجاري المصغر؟</h2>
          <p className="text-blue-200 text-lg mb-10">انضم إلى آلاف التجار العراقيين وابدأ النمو اليوم.</p>
          <Button size="lg" className="bg-[#34D399] text-gray-900 hover:bg-[#6EE7B7]">
            إنشاء حساب مجاني
          </Button>
        </div>
      </section>

      <footer className="bg-gray-50 py-10 border-t border-gray-200">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 منصة جملا. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-900 cursor-pointer">عن جملا</span>
            <span className="hover:text-gray-900 cursor-pointer">الشروط والأحكام</span>
            <span className="hover:text-gray-900 cursor-pointer">سياسة الخصوصية</span>
            <span className="hover:text-gray-900 cursor-pointer">اتصل بنا</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
