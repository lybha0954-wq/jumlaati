'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Store, Package, ArrowLeft, Layers } from 'lucide-react';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب الأقسام من قاعدة البيانات (من عمود category في جدول المنتجات)
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('products').select('category');
      
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      // استخراج الأقسام الفريدة وعدد المنتجات في كل قسم
      if (data) {
        const counts: Record<string, number> = {};
        data.forEach((product) => {
          const cat = product.category || 'غير مصنف';
          counts[cat] = (counts[cat] || 0) + 1;
        });

        const catArray = Object.entries(counts).map(([name, count]) => ({
          name,
          count,
        }));

        setCategories(catArray);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* الترويسة */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">الأقسام</h1>
            <p className="text-sm text-slate-400">تصفح المنتجات حسب الفئة أو القسم</p>
          </div>
          <button 
            onClick={() => router.push('/retailer/browse')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={20} /> العودة للتصفح
          </button>
        </div>

        {/* شبكة الأقسام */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">جاري تحميل الأقسام...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
            <div className="bg-slate-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers size={40} className="text-slate-500" />
            </div>
            <p className="text-slate-400">لا توجد أقسام حالياً. أضف منتجات لتظهر الأقسام هنا!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => router.push(`/retailer/browse?category=${encodeURIComponent(cat.name)}`)}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 rounded-3xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
              >
                <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <Store size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                  <Package size={12} /> {cat.count} منتج
                </p>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
