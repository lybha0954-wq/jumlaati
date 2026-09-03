"use client";
import { Topbar } from "@/components/dashboard/Topbar";
import { formatCurrency } from "@/lib/utils/currency";
import { DeliveryStats } from "@/app/(dashboard)/delivery/components/DeliveryStats";

export default function DeliveryEarningsPage() {
  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">أرباحي</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DeliveryStats title="أرباح هذا الشهر" value={formatCurrency(150000)} icon="💵" />
        <DeliveryStats title="إجمالي الأرباح" value={formatCurrency(450000)} icon="💰" />
      </div>
    </div>
  );
}
