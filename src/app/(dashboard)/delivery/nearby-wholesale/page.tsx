import { Topbar } from "@/components/dashboard/Topbar";

export default function DeliveryNearbyWholesalePage() {
  const wholesalers = [
    { id: "W1", name: "شركة النور للجملة", city: "بغداد", distance: "2.5 كم" },
    { id: "W2", name: "مؤسسة الخير التجارية", city: "بغداد", distance: "4.1 كم" },
    { id: "W3", name: "متجر الأمانة", city: "بغداد", distance: "6.8 كم" },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">تجار الجملة القريبون</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wholesalers?.map((w) => (
          <div key={w?.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-1">{w?.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{w?.city}</p>
            <p className="text-sm text-primary font-medium">📍 {w?.distance}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
