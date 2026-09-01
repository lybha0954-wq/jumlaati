"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/currency";
import { Minus, Plus, ShoppingCart, Heart, Truck, ShieldCheck, RotateCcw } from "lucide-react";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  // الحل الصحيح: استخدام useEffect لجلب الـ slug بعد تحميل الصفحة
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  // بيانات تجريبية (سيتم استبدالها بالاتصال الفعلي بـ API لاحقاً)
  const product = {
    id: slug || "unknown",
    name: "ساعة ذكية فاخرة بإطار من الفولاذ",
    price: 85000,
    oldPrice: 100000,
    category: "إلكترونيات",
    description: "ساعة ذكية بمزايا متطورة، شاشة AMOLED فائقة الوضوح، مقاومة للماء، وتدعم الرياضات المتعددة. مثالية للاستخدام اليومي والرياضي.",
    isWholesale: false,
    rating: 4.8,
    reviews: 124
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
    showToast("تمت الإضافة إلى السلة بنجاح!", "success");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // الانتقال إلى السلة أو صفحة الدفع
    window.location.href = "/dashboard/retailer/cart";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 px-4">
      {/* ... باقي كود الواجهة كما هو (نفس التصميم السابق) ... */}
      {/* سأضع هنا ملخصاً مقتضباً للجزء المرئي حتى لا يطول الرد، يمكنك نسخ التصميم من الإصدار السابق في الرسائل */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
         {/* ... بقية الصفحة ... */}
         <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
         {/* ... أزرار وكمية ... */}
         <Button onClick={handleAddToCart} size="lg" className="flex-1 justify-center gap-2">
            <ShoppingCart size={20} /> أضف إلى السلة
         </Button>
      </div>
    </div>
  );
}
