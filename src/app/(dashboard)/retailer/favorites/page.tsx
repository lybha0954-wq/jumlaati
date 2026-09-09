"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { RequestCard } from "@/components/shared/RequestCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { Heart } from "lucide-react";

export default function RetailerFavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/wishlist", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setFavorites(data.map((item: any) => item.products));
        }
      } catch (error) {
        showToast("خطأ في جلب المفضلة", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">المنتجات المفضلة</h1>
        {favorites.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Heart className="mx-auto mb-4 text-gray-300" size={48} />
            لا توجد منتجات في المفضلة بعد.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <RequestCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
