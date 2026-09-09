import { Topbar } from "@/components/shared/Topbar";
import { formatCurrency } from "@/lib/utils/currency";

export default function DeliveryEarningsPage() {
  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">أرباحي</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-green-600">{formatCurrency(150000)}</h3>
            <p className="text-gray-500 mt-2">أرباح هذا الشهر</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-primary">{formatCurrency(450000)}</h3>
            <p className="text-gray-500 mt-2">إجمالي الأرباح</p>
        </div>
      </div>
    </div>
  );
}
