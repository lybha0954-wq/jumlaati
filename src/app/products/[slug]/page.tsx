// مسار الملف: app/products/[slug]/page.tsx

import { createClient } from '@/lib/supabase/server'; // استخدم عميل الخادم (Server Client)
import { notFound } from 'next/navigation';
import { productService } from '@/lib/services/productService'; // نستدعي خدمتك ولكن بطريقة ذكية

// 1. نجلب قائمة المنتجات لبناء الصفحات مسبقاً (لتوليد آلاف الصفحات)
export async function generateStaticParams() {
  // نستخدم خدمتك لجلب كل المنتجات (تعمل هنا لأنها في مرحلة البناء)
  const products = await productService.getAll(); 
  
  // نرجع مصفوفة من الـ slugs (سنعتبر الـ id هو الـ slug حالياً)
  return products.map((product) => ({
    slug: product.id, // نستخدم الـ id كرابط، يمكنك لاحقاً استبداله بـ product.slug
  }));
}

// 2. نحدد مدة صلاحية الصفحة المخزنة (ISR) - ستتجدد كل ساعة
export const revalidate = 3600; // 3600 ثانية = ساعة واحدة

// 3. مكون الصفحة الرئيسي (Server Component)
export default async function ProductPage({ params }: { params: { slug: string } }) {
  // ننتظر حتى يتم حل الـ params في Next.js 15
  const { slug } = await params; 

  // نقوم بجلب بيانات هذا المنتج المحدد عبر معرفه (UUID)
  const supabase = createClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', slug) // نبحث بالـ id الذي يمثل الـ slug
    .single();

  // إذا لم يوجد المنتج أو حصل خطأ، نظهر صفحة 404
  if (error || !product) {
    notFound();
  }

  // ------ عرض تفاصيل المنتج (UI) ------
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* القسم الأيمن: الصورة (ضع placeholder مؤقت) */}
        <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">صورة المنتج</span>
        </div>

        {/* القسم الأيسر: التفاصيل */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">التصنيف: {product.category}</p>
          
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-green-600">
              {product.final_price} ريال
            </span>
            {product.original_price > product.final_price && (
              <span className="text-lg line-through text-gray-400">
                {product.original_price} ريال
              </span>
            )}
          </div>

          <div className="mt-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              product.status === 'متوفر' ? 'bg-green-100 text-green-800' :
              product.status === 'نفد' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              الحالة: {product.status}
            </span>
            <span className="mr-4 text-sm text-gray-600">المخزون: {product.stock} وحدة</span>
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-500">
              المورد: {product.supplier_name || 'غير محدد'}
            </p>
            <p className="text-sm text-gray-500">
              مدة التوصيل: {product.delivery_days || 1} أيام
            </p>
          </div>

          {/* زر الإضافة إلى السلة */}
          <button className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition">
            أضف إلى السلة
          </button>
        </div>
      </div>
    </div>
  );
}
