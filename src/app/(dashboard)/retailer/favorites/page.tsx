import { RequestCard } from "@/components/shared/RequestCard";
import { Topbar } from "@/components/dashboard/Topbar";

export default function RetailerFavoritesPage() {
  // سيتم جلب المفضلة من قاعدة البيانات لاحقاً
  const favorites = [
    { id: "1", name: "منتج مفضل 1", price: 5000, category: "إلكترونيات", isWholesale: false },
    { id: "2", name: "منتج مفضل 2", price: 25000, category: "أغذية", isWholesale: true },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">المنتجات المفضلة</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites?.map((product) => <RequestCard key={product?.id} product={product} />)}
      </div>
    </div>
  );
}
