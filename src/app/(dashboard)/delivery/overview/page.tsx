import { Topbar } from "@/components/dashboard/Topbar";
import { DeliveryStats } from "@/app/(dashboard)/delivery/components/DeliveryStats";

export default function DeliveryOverviewPage() {
  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">نظرة عامة للمندوب</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DeliveryStats title="طلبات قيد الانتظار" value="12" icon="⏳" />
        <DeliveryStats title="طلبات تم تسليمها" value="58" icon="✅" />
        <DeliveryStats title="أرباح اليوم (د.ع)" value="25,000" icon="💰" />
      </div>
      <p className="text-gray-500">سيتم عرض أحدث المهام هنا لاحقاً.</p>
    </div>
  );
}
