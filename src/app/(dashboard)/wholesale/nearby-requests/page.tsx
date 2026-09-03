"use client";
import { Topbar } from "@/components/dashboard/Topbar";

export default function WholesaleNearbyRequestsPage() {
  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">طلبات قريبة منك</h1>
      <p className="text-gray-500">سيتم عرض طلبات تجار التجزئة القريبة هنا لاحقاً.</p>
    </div>
  );
}
