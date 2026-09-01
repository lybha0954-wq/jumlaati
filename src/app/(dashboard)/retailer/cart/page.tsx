"use client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/currency";
import { Trash2, Plus, Minus, ArrowLeft, MapPin } from "lucide-react";
import { useState } from "react";

export default function RetailerCartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const { showToast } = useToast();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!address.trim()) {
      showToast("يرجى إدخال عنوان التوصيل", "error");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
          address: address
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "حدث خطأ ما");
      }

      useCartStore.getState().clearCart();
      showToast("تم إتمام الطلب بنجاح! 🎉", "success");
      router.push(`/dashboard/retailer/orders/${data.order.id}`); // سيتم توجيهه لصفحة التتبع
      
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
         <div className="text-8xl mb-6">🛒</div>
         <h2 className="text-2xl font-bold text-gray-800 mb-2">سلتك فارغة</h2>
         <p className="text-gray-500 mb-8">لم تقم بإضافة أي منتجات بعد.</p>
         <Button onClick={() => router.push("/")}>تصفح المنتجات</Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-primary transition-colors">
          <ArrowLeft size={16} /> متابعة التسوق
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">سلة المشتريات</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
               <div key={item.productId} className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-24 w-24 bg-gray-100 rounded-xl flex items-center justify-center text-4xl shrink-0">🛍️</div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                     <div className="flex justify-between items-start gap-4">
                        <div>
                           <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                           <p className="text-sm text-gray-500">السعر: {formatCurrency(item.price)}</p>
                        </div>
                        <button onClick={() => removeItem(item.productId)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                           <Trash2 size={18} />
                        </button>
                     </div>
                     <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-gray-200 rounded-full bg-gray-50">
                           <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="p-2 hover:bg-gray-200 rounded-r-full transition-colors"><Minus size={14} /></button>
                           <span className="w-10 text-center font-bold">{item.quantity}</span>
                           <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 hover:bg-gray-200 rounded-l-full transition-colors"><Plus size={14} /></button>
                        </div>
                        <p className="text-xl font-extrabold text-primary">{formatCurrency(item.price * item.quantity)}</p>
                     </div>
                  </div>
               </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
               <h2 className="text-xl font-bold mb-6 border-b pb-4">ملخص الطلب</h2>
               <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                     <span>المجموع الفرعي</span>
                     <span>{formatCurrency(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                     <span>الشحن</span>
                     <Badge variant="secondary">مجاني</Badge>
                  </div>
                  <div className="h-px bg-gray-200 my-4"></div>
                  <div className="flex justify-between text-xl font-extrabold text-gray-900">
                     <span>الإجمالي</span>
                     <span className="text-primary">{formatCurrency(getTotal())}</span>
                  </div>
               </div>

               <div className="mb-6">
                  <label className="text-sm font-semibold mb-2 flex items-center gap-2"><MapPin size={16} /> عنوان التوصيل</label>
                  <Input placeholder="بغداد - الكرادة - شارع 62" value={address} onChange={(e) => setAddress(e.target.value)} />
               </div>

               <Button onClick={handleCheckout} size="lg" disabled={loading} className="w-full justify-center gap-2 shadow-lg">
                 {loading ? "جارٍ إتمام الطلب..." : "إتمام الطلب الآن"}
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
