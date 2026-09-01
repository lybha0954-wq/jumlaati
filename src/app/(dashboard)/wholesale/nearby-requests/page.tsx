import { Topbar } from "@/components/shared/Topbar";

export default function WholesaleNearbyRequestsPage() {
  const requests = [
    { id: "NR-1", retailer: "متجر الأمل", distance: "1.2 كم", items: 5 },
    { id: "NR-2", retailer: "متجر الفرح", distance: "3.4 كم", items: 12 },
    { id: "NR-3", retailer: "متجر الزهراء", distance: "5.0 كم", items: 3 },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">الطلبات القريبة</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests?.map((r) => (
          <div key={r?.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-1">{r?.retailer}</h3>
            <p className="text-sm text-gray-500 mb-2">📍 {r?.distance}</p>
            <p className="text-sm text-primary font-medium">{r?.items} منتجات مطلوبة</p>
          </div>
        ))}
      </div>
    </div>
  );
}
