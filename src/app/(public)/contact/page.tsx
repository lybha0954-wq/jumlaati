"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatCurrency } from "@/lib/utils/currency";
import { 
  ArrowLeft, CreditCard, Wallet, MapPin, Phone, User, 
  ShieldCheck, Lock, Truck, CheckCircle2 
} from "lucide-react";

export default function CheckoutPage() {
  const { items, clearCart, getTotal } = useCartStore();
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // هنا يتم الاتصال بـ API لإنشاء الطلب
    // await fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderData) });

    showToast("تم تأكيد الطلب بنجاح! 🎉", "success");
    
    setTimeout(() => {
      clearCart();
      router.push("/dashboard/retailer/orders");
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-10 rounded-3xl shadow-sm">
          <div className="text-6xl mb-4">🧾</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">لا يوجد طلب للمتابعة</h2>
          <p className="text-gray-500 mb-6">سلتك فارغة، أضف منتجات أولاً.</p>
          <Button onClick={() => router.push("/")}>تصفح المتجر</Button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-8 hover:text-primary transition-colors">
          <ArrowLeft size={18} /> العودة للسلة
        </button>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-10">إتمام عملية الشراء</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* القسم الأيسر: البيانات */}
          <div className="lg:col-span-2 space-y-6">
            {/* معلومات التوصيل */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                <MapPin className="text-primary" size={20} /> عنوان التوصيل
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute right-3 top-3 text-gray-400" size={18} />
                  <Input name="name" placeholder="الاسم الكامل" className="pr-10" required />
                </div>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 text-gray-400" size={18} />
                  <Input name="phone" placeholder="رقم الهاتف (07xxxxxxxxx)" className="pr-10" required />
                </div>
                <div className="md:col-span-2 relative">
                  <MapPin className="absolute right-3 top-3 text-gray-400" size={18} />
                  <Input name="address" placeholder="العنوان الكامل (المدينة - المنطقة - الشارع)" className="pr-10" required />
                </div>
                <div className="md:col-span-2">
                  <Select name="governorate" defaultValue="بغداد">
                    <option value="بغداد">بغداد</option>
                    <option value="البصرة">البصرة</option>
                    <option value="أربيل">أربيل</option>
                    <option value="النجف">النجف</option>
                    <option value="الموصل">الموصل</option>
                  </Select>
                </div>
              </div>
            </div>

            {/* طريقة الدفع */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                <CreditCard className="text-primary" size={20} /> طريقة الدفع
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-4 border-2 border-primary/50 bg-primary/5 rounded-xl p-4 cursor-pointer transition-all">
                  <input type="radio" name="payment" defaultChecked className="accent-primary scale-125" />
                  <Wallet size={24} className="text-primary" />
                  <span className="flex-1 font-semibold">الدفع عند الاستلام</span>
                  <span className="text-xs text-gray-500">نقداً أو بالبطاقة عند وصول الطلب</span>
                </label>
                <label className="flex items-center gap-4 border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-300 transition-all">
                  <input type="radio" name="payment" className="accent-primary scale-125" />
                  <CreditCard size={24} className="text-gray-500" />
                  <span className="flex-1 font-semibold">بطاقة مصرفية (Online)</span>
                  <span className="text-xs text-gray-500">دفع آمن ومشفّر</span>
                </label>
              </div>
            </div>
          </div>

          {/* القسم الأيمن: ملخص الطلب */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">ملخص الطلب</h2>
              <div className="space-y-4 max-h-56 overflow-y-auto pl-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">🛍️</div>
                      <div>
                        <p className="font-semibold line-clamp-1">{item.name}</p>
                        <p className="text-gray-500 text-xs">الكمية: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-200 my-6"></div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span>{formatCurrency(getTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span className="text-emerald-600 font-semibold">مجاني</span>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-6"></div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">الإجمالي النهائي</span>
                <span className="text-2xl font-extrabold text-primary">{formatCurrency(getTotal())}</span>
              </div>

              <Button type="submit" size="lg" disabled={loading} className="w-full justify-center gap-2 text-lg shadow-lg">
                {loading ? "جارٍ تأكيد الطلب..." : <><Lock size={18} /> تأكيد الطلب الآن</>}
              </Button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <ShieldCheck size={14} className="text-emerald-500" /> بياناتك محمية ومشفرة بالكامل
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
