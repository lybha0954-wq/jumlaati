"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { formatCurrency } from "@/lib/utils/currency";
import { Minus, Plus, ShoppingCart, Heart, Truck, ShieldCheck, RotateCcw } from "lucide-react";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [slug, setSlug] = useState<string>("");
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();
  const router = useRouter();

  useState(() => {
    params.then((p) => setSlug(p.slug));
  });

  // هنا يتم جلب البيانات من الـ API أو Supabase في الوضع الحقيقي
  const product = {
    id: slug,
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
    router.push("/dashboard/retailer/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 lg:p-12">
          
          {/* الصورة */}
          <div className="relative">
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
               {/* استخدم Next/Image هنا لاحقاً */}
               <span className="text-9xl">⌚</span>
               <Badge className="absolute top-4 right-4" variant={product.isWholesale ? "default" : "secondary"}>
                  {product.isWholesale ? "سعر جملة" : "سعر تجزئة"}
               </Badge>
               <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 left-4 p-3 bg-white/80 backdrop-blur rounded-full shadow hover:scale-110 transition-transform"
               >
                  <Heart className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"} size={20} />
               </button>
            </div>
          </div>

          {/* التفاصيل */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
               <span className="text-yellow-500 text-lg">★★★★★</span>
               <span className="text-gray-500 text-sm">({product.reviews} تقييم)</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-end gap-3 mb-8">
               <span className="text-4xl font-black text-primary">{formatCurrency(product.price)}</span>
               {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through mb-1">{formatCurrency(product.oldPrice)}</span>
               )}
            </div>

            {/* عداد الكمية */}
            <div className="flex items-center gap-6 mb-8">
               <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100 transition-colors"><Minus size={16} /></button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100 transition-colors"><Plus size={16} /></button>
               </div>
               <span className="text-sm text-gray-500">متوفر في المخزون</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
               <Button onClick={handleAddToCart} size="lg" className="flex-1 justify-center gap-2">
                  <ShoppingCart size={20} /> أضف إلى السلة
               </Button>
               <Button onClick={handleBuyNow} variant="secondary" size="lg" className="flex-1 justify-center gap-2">
                  شراء الآن
               </Button>
            </div>

            {/* ضمانات الشراء */}
            <div className="grid grid-cols-3 gap-4 border-t pt-6 text-center">
               <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Truck size={24} className="text-primary" />
                  <span className="text-xs">توصيل سريع</span>
               </div>
               <div className="flex flex-col items-center gap-2 text-gray-500">
                  <ShieldCheck size={24} className="text-primary" />
                  <span className="text-xs">ضمان الجودة</span>
               </div>
               <div className="flex flex-col items-center gap-2 text-gray-500">
                  <RotateCcw size={24} className="text-primary" />
                  <span className="text-xs">إرجاع مجاني</span>
               </div>
            </div>
          </div>
        </div>

        {/* الوصف التفصيلي (Tabs) */}
        <div className="border-t p-8 lg:p-12">
          <Tabs defaultValue="description">
             <TabsList className="bg-gray-100 p-1 rounded-full">
                <TabsTrigger value="description">الوصف</TabsTrigger>
                <TabsTrigger value="details">المواصفات</TabsTrigger>
                <TabsTrigger value="reviews">التقييمات</TabsTrigger>
             </TabsList>
             <TabsContent value="description" className="pt-6 text-gray-700 leading-relaxed">
                <p>{product.description}</p>
                <p className="mt-4">تم تصميم هذا المنتج ليمنحك أفضل تجربة استخدام بفضل المواد عالية الجودة والتقنيات الحديثة. يعمل بكفاءة عالية ومثالي للاستخدام اليومي أو التجاري.</p>
             </TabsContent>
             <TabsContent value="details" className="pt-6 text-gray-700">
                <ul className="list-disc pr-5 space-y-2">
                   <li>نوع البطارية: ليثيوم أيون</li>
                   <li>مقاومة الماء: نعم (IP68)</li>
                   <li>الشاشة: AMOLED بحجم 1.43 إنش</li>
                   <li>الألوان: أسود، فضي، ذهبي</li>
                </ul>
             </TabsContent>
             <TabsContent value="reviews" className="pt-6">
                <p className="text-gray-500">لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج!</p>
             </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
