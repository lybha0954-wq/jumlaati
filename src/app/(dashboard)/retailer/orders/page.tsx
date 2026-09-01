"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/currency";
import { 
  PackageCheck, Truck, Home, MapPin, Phone, Star, ArrowLeft, MessageSquare 
} from "lucide-react";

export default function TrackOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // بيانات تجريبية - سيتم جلبها لاحقاً من الـ API
  const order = {
    id: params.id,
    status: "shipped", // pending, processing, shipped, delivered
    createdAt: "2026-09-01",
    items: [
      { id: 1, name: "ساعة ذكية فاخرة", qty: 1, price: 85000 },
      { id: 2, name: "حقيبة جلدية", qty: 2, price: 50000 }
    ],
    total: 185000,
    address: "بغداد - الكرادة - شارع 62",
    driver: {
      name: "أحمد محمد",
      rating: 4.9,
      phone: "07701234567"
    }
  };

  const steps = [
    { label: "تم استلام الطلب", date: "قبل ساعتين", icon: PackageCheck, done: true },
    { label: "قيد التجهيز", date: "قبل ساعة", icon: Truck, done: true },
    { label: "في الطريق إليك", date: "الآن", icon: MapPin, done: false, active: true },
    { label: "تم التسليم", date: "متوقع خلال ساعة", icon: Home, done: false }
  ];

  return (
    <div dir="rtl" className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-8 hover:text-primary transition-colors">
          <ArrowLeft size={18} /> العودة للطلبات
        </button>

        {/* الحالة الرئيسية */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full mb-4 animate-pulse">
            <Truck size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">طلبك في الطريق! 🚚</h1>
          <p className="text-gray-500 mb-4">رقم الطلب: <span className="font-bold text-gray-800">#{order.id}</span></p>
          <Badge variant="success" className="text-sm px-4 py-1.5">قيد الشحن</Badge>
        </div>

        {/* المسار الزمني (Timeline) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold mb-8">حالة الطلب</h2>
          <div className="relative">
            {/* الخط العمودي */}
            <div className="absolute right-[19px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="relative flex items-start gap-4">
                  <div className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    step.done ? "bg-primary border-primary text-white" :
                    step.active ? "bg-white border-primary text-primary animate-pulse" : "bg-gray-50 border-gray-200 text-gray-300"
                  }`}>
                    <step.icon size={18} />
                  </div>
                  <div className="flex-1 flex justify-between items-start pt-1">
                    <div>
                      <p className={`font-bold ${step.done || step.active ? "text-gray-800" : "text-gray-400"}`}>{step.label}</p>
                      <p className={`text-sm ${step.done || step.active ? "text-gray-500" : "text-gray-300"}`}>{step.date}</p>
                    </div>
                    {step.active && <Badge>المرحلة الحالية</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* معلومات المندوب والمنتج */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold mb-4 text-lg">معلومات المندوب</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 bg-gradient-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {order.driver.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{order.driver.name}</p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" /> {order.driver.rating}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full"><Phone size={18} /></Button>
                <Button variant="outline" size="icon" className="rounded-full"><MessageSquare size={18} /></Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold mb-4 text-lg">تفاصيل العنوان</h3>
            <p className="flex items-center gap-2 text-gray-600 mb-4"><MapPin size={18} className="text-primary" /> {order.address}</p>
            <div className="h-px bg-gray-200 my-4"></div>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.qty}</span>
                  <span className="font-semibold">{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-gray-200 my-4"></div>
            <div className="flex justify-between text-lg font-bold">
              <span>الإجمالي</span>
              <span className="text-primary">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-8" onClick={() => router.push("/dashboard/retailer/orders")}>
          العودة لقائمة الطلبات
        </Button>
      </div>
    </div>
  );
}
