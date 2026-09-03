"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatCurrency } from "@/lib/utils/currency";
import { ArrowLeft, CreditCard, Wallet, MapPin, ShieldCheck, Lock } from "lucide-react";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone || !name) {
      showToast("يرجى ملء جميع الحقول", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity, wholesalerId: i.wholesalerId })),
          address, phone, name
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ");
      clearCart();
      showToast("تم تأكيد الطلب! 🎉", "success");
      router.push("/dashboard/retailer/orders");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-8 hover:text-primary transition-colors">
          <ArrowLeft size={18} /> العودة للسلة
        </button>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10">إتمام عملية الشراء</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                <MapPin className="text-primary" size={20} /> عنوان التوصيل
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input name="phone" placeholder="رقم الهاتف (07xxxxxxxxx)" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <div className="md:col-span-2">
                  <Input name="address" placeholder="العنوان الكامل" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="md:col-span-2">
                  <Select name="governorate" defaultValue="بغداد">
                    <option value="بغداد">بغداد</option>
                    <option value="البصرة">البصرة</option>
                    <option value="أربيل">أربيل</option>
                    <option value="النجف">النجف</option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                <CreditCard className="text-primary" size={20} /> طريقة الدفع
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-4 border-2 border-primary/50 bg-primary/5 rounded-xl p-4 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="accent-primary scale-125" />
                  <Wallet size={24} className="text-primary" />
                  <span className="flex-1 font-semibold">الدفع عند الاستلام</span>
                </label>
                <label className="flex items-center gap-4 border-2 border-gray-200 rounded-xl p-4 cursor-pointer">
                  <input type="radio" name="payment" className="accent-primary scale-125" />
                  <CreditCard size={24} className="text-gray-500" />
                  <span className="flex-1 font-semibold">بطاقة مصرفية</span>
                </label>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">ملخص الطلب</h2>
              <div className="h-px bg-gray-200 my-6"></div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">الإجمالي</span>
                <span className="text-2xl font-extrabold text-primary">{formatCurrency(getTotal())}</span>
              </div>
              <Button type="submit" size="lg" disabled={loading} className="w-full justify-center gap-2">
                {loading ? "جارٍ التأكيد..." : <><Lock size={18} /> تأكيد الطلب</>}
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <ShieldCheck size={14} className="text-emerald-500" /> بياناتك محمية
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
