import Header from "@/components/shared/Topbar"; // أو استخدم Header المخصص للمتجر
import ProductCard from "@/components/shared/RequestCard"; // أو استخدم ProductCard من الصفحة السابقة
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-gray-50">
      <Header />
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">مرحباً بك في جملا</h1>
        <p className="text-lg md:text-xl mb-8">أفضل منصة عراقية للبيع بالجملة والتجزئة</p>
        <Button className="bg-white text-blue-600 hover:bg-gray-100">تصفح المتجر</Button>
      </section>
      <section className="container mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6">أحدث المنتجات</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* هنا يتم جلب المنتجات من الـ API أو قاعدة البيانات */}
        </div>
      </section>
    </main>
  );
}
