import { Topbar } from "@/components/dashboard/Topbar";

export default function DeliveryMyWholesalersPage() {
  const wholesalers = [
    { id: "W1", name: "شركة النور للجملة", city: "بغداد", orders: 14 },
    { id: "W2", name: "مؤسسة الخير التجارية", city: "أربيل", orders: 8 },
    { id: "W3", name: "متجر الأمانة", city: "البصرة", orders: 5 },
  ];

  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">تجار الجملة الخاصون بي</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wholesalers?.map((w) => (
          <div key={w?.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-1">{w?.name}</h3>
            <p className="text-gray-500 text-sm mb-3">{w?.city}</p>
            <p className="text-sm text-primary font-medium">{w?.orders} طلب مكتمل</p>
          </div>
        ))}
      </div>
    </div>
  );
}
