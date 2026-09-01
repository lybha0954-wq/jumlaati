import { productService } from "@/lib/services/productService";
import { RequestCard } from "@/components/shared/RequestCard";
import { Button } from "@/components/ui/Button";

export default async function Home() {
  // جلب المنتجات الحقيقية من قاعدة البيانات
  const products = await productService?.getAllProducts();

  return (
    <main dir="rtl" className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-indigo-700 text-white py-24 text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="container relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-black mb-6 drop-shadow-lg">منصة <span className="text-yellow-300">جملا</span> التجارية</h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/90">
            أفضل منصة عراقية للبيع بالجملة والتجزئة، اربط تجارتك مع آلاف الموردين بأفضل الأسعار وبأعلى جودة.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-primary hover:bg-white">تصفح المتجر</Button>
            <Button variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10">إنشاء حساب مجاني</Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container pb-20 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">أحدث المنتجات</h2>
          <Button variant="ghost">المزيد ←</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <RequestCard key={product?.id} product={product} />
          ))}
          
          {/* في حال عدم وجود منتجات بعد */}
          {products?.length === 0 && (
            <div className="col-span-4 text-center py-10 text-gray-500">
              <p>لا توجد منتجات بعد. أضف أول منتج من لوحة تحكم الجملة!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
