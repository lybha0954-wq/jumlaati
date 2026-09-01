import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  // مثال على بيانات مؤقتة (سنتغير لاحقاً لتصبح من Supabase)
  const products = [
    { id: 1, name: 'منتج تجريبي 1', price: 5000, category: 'جملة' },
    { id: 2, name: 'منتج تجريبي 2', price: 2500, category: 'تجزئة' },
  ];

  return (
    <main dir="rtl">
      <Header />
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 text-center">
        <h1 className="text-4xl font-bold">مرحباً بك في جملا</h1>
        <p className="mt-4 text-lg">أفضل الأسعار للجملة والتجزئة في العراق</p>
      </section>
      <section className="container mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6">أحدث المنتجات</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </main>
  );
}
