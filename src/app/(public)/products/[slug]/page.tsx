"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/currency";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Topbar } from "@/components/dashboard/Topbar";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [quantity, setQuantity] = useState(1);
  const [slug, setSlug] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  useEffect(() => { params.then((p) => setSlug(p.slug)); }, [params]);

  const product = {
    id: slug || "unknown",
    wholesalerId: "demo-wholesaler",
    name: "ساعة ذكية فاخرة",
    price: 85000,
    description: "ساعة ذكية بمزايا متطورة.",
  };

  const handleAddToCart = () => {
    addItem({ productId: product.id, wholesalerId: product.wholesalerId, name: product.name, price: product.price, quantity });
    showToast("تمت الإضافة إلى السلة!", "success");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
          <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-9xl">⌚</div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="text-4xl font-black text-primary mb-8">{formatCurrency(product.price)}</div>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center border-2 border-gray-200 rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3"><Minus size={16} /></button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3"><Plus size={16} /></button>
              </div>
         # حذف الملف التالف
rm -f "src/app/(public)/products/[slug]/page.tsx"

# إعادة إنشائه بشكل نظيف وكامل
cat > "src/app/(public)/products/[slug]/page.tsx" << 'EOF'
"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/currency";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Topbar } from "@/components/dashboard/Topbar";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [quantity, setQuantity] = useState(1);
  const [slug, setSlug] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  useEffect(() => { params.then((p) => setSlug(p.slug)); }, [params]);

  const product = {
    id: slug || "unknown",
    wholesalerId: "demo-wholesaler",
    name: "ساعة ذكية فاخرة",
    price: 85000,
    description: "ساعة ذكية بمزايا متطورة.",
  };

  const handleAddToCart = () => {
    addItem({ productId: product.id, wholesalerId: product.wholesalerId, name: product.name, price: product.price, quantity });
    showToast("تمت الإضافة إلى السلة!", "success");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
          <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-9xl">⌚</div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="text-4xl font-black text-primary mb-8">{formatCurrency(product.price)}</div>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center border-2 border-gray-200 rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3"><Minus size={16} /></button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3"><Plus size={16} /></button>
              </div>
            </div>
            <Button onClick={handleAddToCart} size="lg" className="gap-2"><ShoppingCart size={20} /> أضف إلى السلة</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
