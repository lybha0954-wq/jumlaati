import { Topbar } from "@/components/dashboard/Topbar";
import { RequestCard } from "@/components/shared/RequestCard";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const products = [
    { id: "1", name: "هاتف ذكي فاخر", price: 350000, category: "إلكترونيات", isWholesale: false },
    { id: "2", name: "كرتون مياه معدنية", price: 4000, category: "أغذية", isWholesale: true },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-background">
      <Topbar />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-indigo-700 text-white py-24 text-center">
        <div className="container relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-black mb-6">منصة <span className="text-yellow-300">جملا</span> التجارية</h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/90">
            أفضل منصة عراقية للبيع بالجملة والتجزئة.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">تصفح المتجر</Button>
            <Button variant="outline" size="lg" className="border-white/50 text-white">إنشاء حساب مجاني</Button>
          </div>
        </div>
      </section>
      <section className="container pb-20 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">أحدث المنتجات</h2>
          <Button variant="ghost">المزيد ←</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => <RequestCard key={product.id} product={product} />)}
        </div>
      </section>
    </main>
  );
}
