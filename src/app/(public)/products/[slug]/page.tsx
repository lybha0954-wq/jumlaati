"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { formatCurrency } from "@/lib/utils/currency";
import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Topbar } from "@/components/dashboard/Topbar";

export default function ProductPage() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(`/api/reviews?productId=${slug}`);
      if (res.ok) setReviews(await res.json());
    };
    fetchReviews();
  }, [slug]);

  const product = {
    id: slug,
    wholesalerId: "demo-wholesaler",
    name: "ساعة ذكية فاخرة",
    price: 85000,
    description: "ساعة ذكية بمزايا متطورة.",
  };

  const handleAddToCart = () => {
    addItem({ productId: product.id, wholesalerId: product.wholesalerId, name: product.name, price: product.price, quantity });
    showToast("تمت الإضافة إلى السلة!", "success");
  };

  const handleReview = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, rating, comment }),
      });
      if (res.ok) {
        showToast("تم إضافة التقييم", "success");
        setComment("");
      } else {
        const data = await res.json();
        showToast(data.error || "خطأ", "error");
      }
    } catch (error) {
      showToast("خطأ", "error");
    } finally {
      setLoading(false);
    }
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
            
            <div className="mt-10 border-t pt-6">
              <h2 className="text-xl font-bold mb-4">التقييمات ({reviews.length})</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{review.users?.name}</span>
                      <div className="flex text-yellow-500">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-4">
                <Textarea placeholder="اكتب تقييمك..." value={comment} onChange={(e) => setComment(e.target.value)} />
                <div className="flex items-center gap-4">
                  <select className="p-2 border rounded-lg" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[5,4,3,2,1].map((star) => <option key={star} value={star}>{star} نجوم</option>)}
                  </select>
                  <Button onClick={handleReview} variant="outline" disabled={loading}>{loading ? "جارٍ الإرسال..." : "إضافة التقييم"}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
