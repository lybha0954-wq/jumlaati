'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, Trash2, Package, Layers, BarCode } from 'lucide-react';

export default function SupplierProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [costPrice, setCostPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [unit, setUnit] = useState('قطعة');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // جلب المنتجات
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_id', user?.id);
      if (!error && data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, [user?.id]);

  // إضافة منتج
  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert({
      barcode,
      name,
      cost_price: Number(costPrice),
      final_price: Number(finalPrice),
      stock: Number(stock),
      unit,
      supplier_id: user?.id,
    });
    if (!error) {
      setShowForm(false);
      setBarcode(''); setName(''); setCostPrice(0); setFinalPrice(0); setStock(0); setUnit('قطعة');
      const { data } = await supabase.from('products').select('*').eq('supplier_id', user?.id);
      setProducts(data || []);
    }
  };

  // حذف منتج
  const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(products.filter((p) => p.id !== id));
  };

  // فلترة البحث
  const filteredProducts = products.filter((p) => p.name.includes(search));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* الترويسة */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">إدارة المنتجات</h1>
            <p className="text-sm text-slate-400">أضف، عدّل، وتتبع مخزونك باحترافية</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all duration-300 transform hover:scale-105"
          >
            <Plus size={20} />
            {showForm ? 'إغلاق النموذج' : 'إضافة منتج جديد'}
          </button>
        </div>

        {/* نموذج الإضافة (تصميم زجاجي فاخر) */}
        {showForm && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
              تفاصيل المنتج الجديد
            </h2>
            <form onSubmit={addProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <BarCode size={16} className="text-indigo-400" /> الباركود
                  </label>
                  <input
                    type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                    placeholder="امسح أو اكتب الباركود"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Package size={16} className="text-indigo-400" /> اسم المنتج
                  </label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                    className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                    placeholder="مثال: حليب نيدو 2.5 كجم" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">سعر التكلفة</label>
                  <input type="number" value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} required
                    className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/20 transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">سعر البيع</label>
                  <input type="number" value={finalPrice} onChange={(e) => setFinalPrice(Number(e.target.value))} required
                    className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/20 transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">الوحدة</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/20 transition">
                    <option value="قطعة">قطعة</option>
                    <option value="كرتون">كرتون</option>
                    <option value="كيس">كيس</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-105">
                  حفظ المنتج
                </button>
              </div>
            </form>
          </div>
        )}

        {/* قسم البحث وعدّاد المنتجات */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-3.5 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-3 pr-12 pl-4 text-white placeholder-slate-500 focus:border-indigo-500 transition"
            />
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Layers size={18} className="text-indigo-400" />
            <span>إجمالي المنتجات: <span className="font-bold text-white">{products.length}</span></span>
          </div>
        </div>

        {/* شبكة عرض المنتجات (بطاقات فاخرة) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full text-center py-10 text-slate-500">جاري تحميل المنتجات...</div>
          )}
          {!loading && products.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-slate-500" />
              </div>
              <p className="text-slate-400">لا توجد منتجات بعد. ابدأ بإضافة أول منتج!</p>
            </div>
          )}
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-indigo-400">
                  <Package size={24} />
                </div>
                <button onClick={() => deleteProduct(product.id)} className="text-slate-500 hover:text-red-400 transition">
                  <Trash2 size={18} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
              <p className="text-xs text-slate-500 mb-3 font-mono">الباركود: {product.barcode || 'غير محدد'}</p>
              <div className="flex justify-between items-end pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-slate-400">سعر البيع</p>
                  <p className="text-xl font-black text-emerald-400">{product.final_price.toLocaleString()} د.ع</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400">المخزون</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {product.stock} {product.unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
