"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { UserPlus, Check, X } from "lucide-react";

export default function WholesaleNearbyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const { showToast } = useToast();

  const fetchRequests = async () => {
    const res = await fetch("/api/relationships");
    if (res.ok) setRequests(await res.json());
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: string, action: "accept" | "reject") => {
    const res = await fetch(`/api/relationships/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      showToast(action === "accept" ? "تم قبول الطلب" : "تم رفض الطلب", "success");
      fetchRequests();
    } else {
      showToast("حدث خطأ", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">طلبات الانضمام</h1>
        {requests.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center text-gray-500">
            <UserPlus className="mx-auto mb-4 text-gray-300" size={48} />
            لا توجد طلبات انضمام حالياً.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const user = request.retailer || request.delivery;
              return (
                <div key={request.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                      {user?.name?.charAt(0) || "؟"}
                    </div>
                    <div>
                      <h3 className="font-bold">{user?.name}</h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <Badge variant="secondary" className="mt-1">{request.delivery ? "مندوب توصيل" : "تاجر تجزئة"}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleAction(request.id, "accept")}><Check size={14} /> قبول</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleAction(request.id, "reject")}><X size={14} /> رفض</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
