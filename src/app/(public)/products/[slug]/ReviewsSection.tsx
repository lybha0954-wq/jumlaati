"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, MessageSquare, Send, User } from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_name?: string;
}

export function ReviewsSection({ productId }: { productId: string | number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [canPost, setCanPost] = useState(false);
  const { showToast } = useToast();

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  useEffect(() => {
    fetch("/api/users/profile")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setCanPost(!!d?.id || !!d?.email))
      .catch(() => setCanPost(false));
  }, []);

  const submit = async () => {
    if (!comment.trim()) {
      showToast("اكتب تعليقاً أولاً", "error");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: Number(productId), rating, comment: comment.trim() }),
      });
      if (res.ok) {
        showToast("✅ تم إرسال تقييمك", "success");
        setComment("");
        setRating(5);
        fetchReviews();
      } else {
        const d = await res.json().catch(() => ({}));
        showToast(d.error || "فشل الإرسال", "error");
      }
    } catch {
      showToast("خطأ في الاتصال", "error");
    } finally {
      setSending(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="mt-8 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-[#2e8b73]" />
          <h2 className="text-lg font-black text-gray-900">التقييمات</h2>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} size={14}
                  fill={i <= Math.round(Number(avgRating)) ? "#f59e0b" : "none"}
                  className={i <= Math.round(Number(avgRating)) ? "text-amber-500" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-sm font-black text-gray-900">{avgRating}</span>
            <span className="text-xs text-gray-400">({reviews.length})</span>
          </div>
        )}
      </div>

      {canPost && (
        <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
          <p className="mb-3 text-xs font-bold text-gray-700">أضف تقييمك</p>
          <div className="mb-3 flex items-center gap-1">
            {[1,2,3,4,5].map((i) => (
              <button key={i} type="button" onClick={() => setRating(i)}
                className="transition-transform hover:scale-110">
                <Star size={22}
                  fill={i <= rating ? "#f59e0b" : "none"}
                  className={i <= rating ? "text-amber-500" : "text-gray-300"} />
              </button>
            ))}
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="شاركنا تجربتك مع هذا المنتج..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#2e8b73]" />
          <button onClick={submit} disabled={sending}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#2e8b73] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1e6b57] active:scale-95 disabled:opacity-50">
            <Send size={13} /> {sending ? "جاري الإرسال..." : "إرسال"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-100 p-4">
              <div className="h-3 w-24 rounded bg-gray-100" />
              <div className="mt-2 h-3 w-full rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
          <Star className="mx-auto mb-2 h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">لا توجد تقييمات بعد</p>
          <p className="mt-1 text-xs text-gray-400">كن أول من يُقيّم هذا المنتج</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-gray-100 bg-white p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f4f0] text-xs font-black text-[#2e8b73]">
                    <User size={14} />
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {r.reviewer_name || "مستخدم"}
                  </span>
                </div>
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} size={12}
                      fill={i <= r.rating ? "#f59e0b" : "none"}
                      className={i <= r.rating ? "text-amber-500" : "text-gray-300"} />
                  ))}
                </div>
              </div>
              {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
              <p className="mt-2 text-[10px] text-gray-400">
                {String(r.created_at || "").slice(0, 16)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
