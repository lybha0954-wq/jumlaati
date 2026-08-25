'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Search, ShoppingCart, Plus, Minus, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RetailerBrowsePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<any[]>([]);

  // تحميل المنتجات
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();

    // تحميل السلة من التخزين المحلي (مؤقتاً)
    const savedCart = localStorage.getItem('retailer_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // إضافة منتج للسلة (مؤقتاً)
  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, qty: 1 }];
    }
    setCart(newCart);
    localStorage.setItem('retailer_cart', JSON.stringify(newCart));
    alert(`تمت إضافة ${product.name} إلى السلة`);
  };

  // تعديل الكمية في السلة
  const updateQty = (id: string, delta: number) => {
    let newCart = cart.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    setCart(newCart);
    localStorage.setItem('retailer_cart', JSON.stringify(newCart));
  };

  const filteredProducts = products.filter((p) => p.name.includes(search));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* الترويسة والسلة */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">تصفح المنتجات</h1>
            <p className="text-sm text-slate-400">اختر منتجاتك وضيفها إلى سلة الجملة</p>
          </div>
          <button
            onClick={() => router.push('/retailer/cart')}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-105"
          >
            <ShoppingCart size={20} />
            <span className="relative">
              السلة
              {cart.length > 0 && (
                <span className="absolute -top-4 -right-4 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-pulse">
                  {cart.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* البحث والفلترة */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-3.5 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-3 pr-12 pl-4 text-white placeholder-slate-500 focus:border-emerald-500 transition"
            />
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Layers size={18} className="text-emerald-400" />
            <span>المنتجات المتاحة: <span className="font-bold text-white">{filteredProducts.length}</span></span>
          </div>
        </div>

        {/* شبكة المنتجات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading && <div className="col-span-full text-center py-10 text-slate-500">جاري تحميل المنتجات...</div>}
          {!loading && filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-500">لا توجد منتجات مطابقة.</div>
          )}

          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="h-40 w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <Package size={48} className="text-slate-600 group-hover:text-emerald-500/50 transition-colors" />
                  )}
                  <span className="absolute top-2 right-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-full">
                    {product.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                <p className="text-xs text-slate-400 mb-3 font-mono">الباركود: {product.barcode || 'غير محدد'}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-slate-500">الحد الأدنى</p>
                    <p className="text-xs font-bold text-slate-300">{product.min_order_qty} {product.unit}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-500">السعر</p>
                    <p className="text-xl font-black text-emerald-400">{product.final_price.toLocaleString()} د.ع</p>
                  </div>
                </div>
              </div>

              {/* أزرار التحكم */}
              <div className="border-t border-white/10 pt-4">
                {cart.find((item) => item.id === product.id) ? (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2">
                    <button onClick={() => updateQty(product.id, -1)} className="h-8 w-8 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-slate-700 transition">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold text-emerald-400">{cart.find((item) => item.id === product.id)?.qty} {product.unit}</span>
                    <button onClick={() => updateQty(product.id, 1)} className="h-8 w-8 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-slate-700 transition">
                      <Plus size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} /> أضف إلى السلة
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
