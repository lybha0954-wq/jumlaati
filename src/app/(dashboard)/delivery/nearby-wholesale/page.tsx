"use client";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Store } from "lucide-react";

export default function NearbyWholesalePage() {
  const wholesalers = [
    { id: 1, name: "شركة النور", area: "بغداد - الكرادة" },
    { id: 2, name: "مؤسسة الخير", area: "أربيل - عنكاوا" },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">تجار الجملة المتاحون</h1>
      <div className="space-y-4">
        {wholesalers.map((w) => (
          <div key={w.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-lg">
                <Store size={20} />
              </div>
              <div>
                <h3 className="font-bold">{w.name}</h3>
                <p className="text-sm text-gray-500">{w.area}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">متاح للتعاون</Badge>
              <Button size="sm">إرسال طلب</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
