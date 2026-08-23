'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, Trash2, ArrowRight, Package, CreditCard, Truck } from 'lucide-react';

export default function RetailerCartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // تحميل السلة من التخزين المحلي
  useEffect(() => {
    const savedCart = localStorage.getItem('retailer_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // حساب الإجماليات
  const subtotal = cart.reduce((acc, item) => acc + (item.final_price * item.qty), 0);
  const deliveryFee = subtotal > 0 ? 10000 : 0; // رسوم توصيل ثابتة (قابلة للتعديل لاحقاً)
  const total = subtotal + deliveryFee;

  // تعديل الكمية
  const updateQty = (id: string, delta: number) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    setCart(newCart);
    localStorage.setItem('retailer_cart', JSON.stringify(newCart));
  };

  // حذف منتج من السلة
  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem('retailer_cart', JSON.stringify(newCart));
  };

  // إتمام الطلب (إنشاء طلب حقيقي في قاعدة البيانات)
  const handleCheckout = async () => {
    if (cart.length === 0 || !user) return;

    setLoading(true);

    try {
      // 1. إنشاء رقم طلب فريد
      const orderNumber = `ORD-${Date.now()}`;

      // 2. أخذ معرف المورد من أول منتج في السلة (افتراض أن السلة كلها لمورد واحد)
      const supplierId = cart[0]?.supplier_id;

      // 3. إنشاء الطلب في جدول orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          status: 'reviewing', // حالة أولية
          payment_status: 'pending',
          retailer_id: user.id,
          supplier_id: supplierId || null,
          delivery_address: 'بغداد - الكرادة', // يمكن جلبها من البروفايل لاحقاً
          delivery_city: 'بغداد',
          subtotal: subtotal,
          delivery_fee: deliveryFee,
          total: total,
          commission: Math.round(total * 0.05), // عمولة 5%
        })
        .select()
        .single();

      if (orderError) throw orderError;
      const orderId = orderData.id;

      // 4. إضافة تفاصيل المنتجات في جدول order_items
      const orderItems = cart.map((item) => ({
        order_id: orderId,
        product_id: item.id,
        product_name: item.name,
        qty: item.qty,
        unit: item.unit,
        unit_price: item.final_price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 5. تحديث المخزون في جدول المنتجات (خصم الكمية المشتراة)
      for (const item of cart) {
        await supabase
          .from('products')
          .update({ stock: item.stock - item.qty })
          .eq('id', item.id);
      }

      // 6. تفريغ السلة والتوجيه لصفحة الطلبات
      localStorage.removeItem('retailer_cart');
      setCart([]);
      alert('تم إنشاء طلبك بنجاح!');
      router.push('/retailer/orders');

    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إنشاء الطلب. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* الترويسة */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">سلة المشتريات</h1>
            <p className="text-sm text-slate-400">راجع طلبك قبل إرساله للمورد</p>
          </div>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowRight size={20} /> متابعة التصفح
          </button>
        </div>

        {/* محتوى السلة أو حالة فارغة */}
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
            <div className="bg-slate-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={40} className="text-slate-500" />
            </div>
            <p className="text-slate-400">سلتك فارغة حالياً.</p>
            <button
              onClick={() => router.push('/retailer/browse')}
              className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-2xl transition"
            >
              تصفح المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* قائمة المنتجات في السلة */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex items-center justify-between transition hover:border-emerald-500/30">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                      <Package size={28} className="text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{item.name}</h3>
                      <p className="text-xs text-slate-400">{item.unit} - سعر القطعة: {item.final_price.toLocaleString()} د.ع</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-800 rounded-xl p-1">
                      <button onClick={() => updateQty(item.id, -1)} className="h-8 w-8 rounded-lg hover:bg-slate-700 flex items-center justify-center">-</button>
                      <span className="w-10 text-center font-bold">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="h-8 w-8 rounded-lg hover:bg-slate-700 flex items-center justify-center">+</button>
                    </div>
                    <div className="text-left w-24">
                      <p className="text-sm font-bold text-emerald-400">{(item.final_price * item.qty).toLocaleString()} د.ع</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 transition">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ملخص الطلب */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-fit sticky top-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-emerald-400" /> ملخص الطلب
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">المجموع الفرعي</span>
                  <span className="font-bold text-white">{subtotal.toLocaleString()} د.ع</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Truck size={14} className="text-slate-500" /> رسوم التوصيل
                  </span>
                  <span className="font-bold text-white">{deliveryFee.toLocaleString()} د.ع</span>
                </div>
                <div className="border-t border-white/10 my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">الإجمالي</span>
                  <span className="text-2xl font-black text-emerald-400">{total.toLocaleString()} د.ع</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-2xl mt-6 shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري إنشاء الطلب...' : 'تأكيد وإتمام الطلب'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
