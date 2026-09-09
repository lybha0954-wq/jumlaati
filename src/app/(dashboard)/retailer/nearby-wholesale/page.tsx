import { Topbar } from "@/components/shared/Topbar";

export default function RetailerNearbyWholesalePage() {
  const wholesalers = [
    { id: "W1", name: "شركة النور للجملة", city: "بغداد", distance: "1.8 كم", products: 240 },
    { id: "W2", name: "مؤسسة الخير التجارية", city: "بغداد", distance: "3.2 كم", products: 180 },
    { id: "W3", name: "متجر الأمانة", city: "بغداد", distance: "5.5 كم", products: 95 },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">تجار الجملة القريبون</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wholesalers?.map((w) => (
          <div key={w?.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-1">{w?.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{w?.city}</p>
            <p className="text-sm text-primary font-medium mb-1">📍 {w?.distance}</p>
            <p className="text-sm text-gray-600">{w?.products} منتج متاح</p>
          </div>
        ))}
      </div>
    </div>
  );
}
