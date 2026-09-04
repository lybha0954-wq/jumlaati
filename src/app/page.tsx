import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { RequestCard } from "@/components/shared/RequestCard";
import { productService } from "@/lib/services/productService";

export default async function Home() {
  // جلب المنتجات الحقيقية من قاعدة البيانات
  let products: any[] = [];
  try {
    products = await productService.getAllProducts();
  } catch (error) {
    console.error("خطأ في جلب المنتجات:", error);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 text-slate-900">
      
      {/* استخدام المكونات الموجودة والمعروفة لدى Rocket */}
      <Topbar />

      {/* القسم العلوي (Hero) */}
      <section className="bg-[#0F172A] text-white py-24 text-center">
        <h1 className="text-5xl font-black mb-6">جُمْلَتِي</h1>
        <p className="text-lg text-gray-300 mb-10">منصة عراقية متكاملة للبيع بالجملة والتجزئة.</p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="bg-[#f59e0b] text-gray-900">تصفح المتجر</Button>
          <Button variant="outline" size="lg" className="border-white text-white">إنشاء حساب</Button>
        </div>
      </section>

      {/* عرض المنتجات الحقيقية باستخدام المكون الموجود */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8">أحدث المنتجات</h2>
        {products.length === 0 ? (
          <div className="bg-white p-10 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl">
            لا توجد منتجات بعد. قم بإضافة أول منتج من لوحة التحكم.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <RequestCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
