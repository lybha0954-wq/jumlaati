"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { Tag, Percent } from "lucide-react";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/offers");
        if (res.ok) setOffers(await res.json());
      } catch (error) {
        showToast("خطأ في جلب العروض", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">العروض الترويجية</h1>
        {offers.length === 0 ? (
          <div className="bg-white p-10 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl">
            <Tag className="mx-auto mb-4 text-gray-300" size={48} />
            لا توجد عروض متاحة حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Percent className="text-primary" size={24} />
                  <h3 className="font-bold text-lg">{offer.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{offer.discount_percent}% خصم</Badge>
                  <span className="text-sm text-gray-500">حتى {new Date(offer.end_date).toLocaleDateString('ar-IQ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
