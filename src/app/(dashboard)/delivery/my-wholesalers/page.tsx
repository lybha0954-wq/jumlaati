"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { Store } from "lucide-react";

export default function DeliveryMyWholesalersPage() {
  const [wholesalers, setWholesalers] = useState<any[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    // عرض الشركاء المرتبطين
    const fetchPartners = async () => {
      try {
        const res = await fetch("/api/relationships");
        if (res.ok) setWholesalers(await res.json());
      } catch (error) {
        showToast("خطأ في جلب الشركاء", "error");
      }
    };
    fetchPartners();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">تجار الجملة المرتبطون بي</h1>
        {wholesalers.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center text-gray-500">
            <Store className="mx-auto mb-4 text-gray-300" size={48} />
            لا توجد علاقات نشطة حالياً.
          </div>
        ) : (
          <div className="space-y-4">
            {wholesalers.map((w) => (
              <div key={w.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{w.wholesaler?.name || "تاجر جملة"}</h3>
                  <p className="text-sm text-gray-500">{w.wholesaler?.email}</p>
                </div>
                <Badge variant="success">نشط</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
