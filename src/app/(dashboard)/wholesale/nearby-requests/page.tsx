"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CheckCircle2, XCircle, UserPlus, Truck, Store } from "lucide-react";

export default function NearbyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/relationships");
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: "accept" | "reject") => {
    try {
      const res = await fetch(`/api/relationships/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        showToast(action === "accept" ? "تم قبول الطلب بنجاح!" : "تم رفض الطلب", action === "accept" ? "success" : "info");
        router.refresh();
        setRequests(requests.filter((r) => r.id !== id));
      } else {
        showToast("حدث خطأ في العملية", "error");
      }
    } catch (error) {
      showToast("تعذر الاتصال بالخادم", "error");
    }
  };

  if (loading) return <LoadingSpinner />;

  // تحديد نوع الطلب والمرسل
  const getRequesterInfo = (request: any) => {
    if (request.retailer) {
      return { name: request.retailer.name, email: request.retailer.email, type: "تاجر تجزئة", icon: UserPlus };
    } else if (request.delivery) {
      return { name: request.delivery.name, email: request.delivery.email, type: "مندوب توصيل", icon: Truck };
    } else if (request.wholesaler) {
      return { name: request.wholesaler.name, email: request.wholesaler.email, type: "تاجر جملة", icon: Store };
    }
    return { name: "غير معروف", email: "", type: "غير معروف", icon: UserPlus };
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">طلبات الانضمام</h1>
      
      {requests.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm text-center text-gray-500">
          <UserPlus className="mx-auto mb-4 text-gray-300" size={48} />
          لا توجد طلبات انضمام جديدة حالياً.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const requester = getRequesterInfo(request);
            const RequesterIcon = requester.icon;
            return (
              <div key={request.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-lg">
                      <RequesterIcon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{requester.name}</h3>
                      <p className="text-sm text-gray-500">{requester.email}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {requester.type} يطلب الانضمام
                  </Badge>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={() => handleAction(request.id, "accept")} className="gap-2">
                    <CheckCircle2 size={18} /> قبول
                  </Button>
                  <Button onClick={() => handleAction(request.id, "reject")} variant="outline" className="gap-2 text-red-500 hover:bg-red-50">
                    <XCircle size={18} /> رفض
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
