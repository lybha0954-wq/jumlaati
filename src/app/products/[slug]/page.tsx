// app/products/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { cache } from 'react' // لاستخدام الذاكرة المؤقتة داخل الطلب الواحد

// 1. دالة جلب البيانات مع تخزين مؤقت (Caching) لتجنب الجلب المتكرر
const getProduct = cache(async (id: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
})

// 2. توليد المسارات الثابتة (SSG) لأجل آلاف الصفحات - يتم تنفيذها وقت البناء فقط
export async function generateStaticParams() {
  const supabase = createClient()
  // نأخذ المعرفات فقط، وليس كل البيانات (تقليل حمل الذاكرة)
  const { data } = await supabase.from('products').select('id')
  return (data || []).map((product) => ({ slug: product.id }))
}

// 3. تحديث الصفحات كل ساعة (ISR) - يلغي الحاجة لإعادة البناء الكامل
export const revalidate = 3600 // 1 ساعة

// 4. تحسين متقدم لـ SEO و Meta Tags (يُنشئ تلقائياً لآلاف المنتجات)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return { title: 'منتج غير موجود' }
  return {
    title: product.name,
    description: `شراء ${product.name} بأفضل سعر في المتجر`,
    openGraph: { title: product.name, images: [product.image_url || '/default.jpg'] },
  }
}

// 5. مكون الصفحة الرئيسي (Server Component)
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold">{product.name}</h1>
      <p className="text-2xl text-green-600">{product.final_price} ريال</p>
      
      {/* باقي الواجهة - يتم عرضها بسرعة فائقة لأنها مخزنة */}
      <div className="mt-4">
        <span className="bg-blue-100 p-2 rounded">المخزون: {product.stock}</span>
      </div>
    </div>
  )
}
