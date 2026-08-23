'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, Trash2 } from 'lucide-react';

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
      // تحديث القائمة
      const { data } = await supabase.from('products').select('*').eq('supplier_id', user?.id);
      setProducts(data || []);
    }
  };

  // حذف منتج
  const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المنتجات</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} /> إضافة منتج
        </button>
      </div>

      {showForm && (
        <form onSubmit={addProduct} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-6 space-y-4">
          <h2 className="font-bold text-lg text-indigo-400">منتج جديد</h2>
          <div>
            <label className="text-sm text-slate-400 block mb-1">الباركود (أو امسحه بالكاميرا)</label>
            <input
              type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white"
              placeholder="مثال: 628100100101"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">اسم المنتج</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1">سعر التكلفة</label>
              <input type="number" value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1">سعر البيع</label>
              <input type="number" value={finalPrice} onChange={(e) => setFinalPrice(Number(e.target.value))} required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1">الكمية</label>
              <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white" />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1">الوحدة</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white">
                <option value="قطعة">قطعة</option>
                <option value="كرتون">كرتون</option>
                <option value="كيس">كيس</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold">
            حفظ المنتج
          </button>
        </form>
      )}

      <div className="space-y-3">
        {loading && <p className="text-slate-500">جاري التحميل...</p>}
        {products.length === 0 && !loading && <p className="text-slate-500">لا توجد منتجات بعد. أضف أول منتج!</p>}
        {products.map((product) => (
          <div key={product.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-xs text-slate-400">الباركود: {product.barcode || 'بدون'}</p>
              <p className="text-sm text-indigo-400 mt-1">{product.final_price.toLocaleString()} د.ع</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs bg-slate-700 px-2 py-1 rounded-lg">المخزون: {product.stock}</span>
              <button onClick={() => deleteProduct(product.id)} className="text-red-400 hover:text-red-300">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
