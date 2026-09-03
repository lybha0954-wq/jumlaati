"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Topbar } from "@/components/dashboard/Topbar";
import { Search, Store, Send } from "lucide-react";

export default function NearbyWholesalePage() {
  const [wholesalers, setWholesalers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchWholesalers = async () => {
      try {
        const res = await fetch("/api/users?role=wholesaler");
        if (res.ok) {
          const data = await res.json();
          setWholesalers(data);
        }
      } catch (error) {
        console.error("Error fetching wholesalers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWholesalers();
  }, []);

  const handleSendRequest = async (wholesalerId: string) => {
    try {
      const res = await fetch("/api/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wholesalerId }),
      });

      if (res.ok) {
        showToast("تم إرسال طلب الانضمام بنجاح!", "success");
      } else {
        const data = await res.json();
        showToast(data.error || "حدث خطأ في إرسال الطلب", "error");
      }
    } catch (error) {
      showToast("تعذر الاتصال بالخادم", "error");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">تجار الجملة المتاحون</h1>
      
      <div className="relative mb-6">
        <Search className="absolute right-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="ابحث عن تاجر جملة..."
          className="w-full h-12 rounded-xl border border-gray-200 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {wholesalers.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm text-center text-gray-500">
          <Store className="mx-auto mb-4 text-gray-300" size={48} />
          لا يوجد تجار جملة مسجلون حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wholesalers.map((wholesaler) => (
            <div key={wholesaler.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-lg">
                  {wholesaler.name?.charAt(0) || "ج"}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{wholesaler.name}</h3>
                  <p className="text-sm text-gray-500">{wholesaler.email}</p>
                </div>
              </div>
              <Badge variant="secondary" className="mb-4">تاجر جملة</Badge>
              <Button onClick={() => handleSendRequest(wholesaler.id)} className="w-full gap-2">
                <Send size={16} /> إرسال طلب انضمام
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
