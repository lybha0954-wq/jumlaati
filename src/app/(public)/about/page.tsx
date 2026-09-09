import { Topbar } from "@/components/dashboard/Topbar";
import { Store, Truck, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6">عن جُمْلَتِي</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          جُمْلَتِي هي منصة عراقية متكاملة تهدف إلى ربط تجار التجزئة مع تجار الجملة والموردين المحليين بطريقة سهلة وآمنة.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <Store className="mx-auto mb-4 text-primary" size={32} />
            <h3 className="font-bold text-lg mb-2">تجارة الجملة</h3>
            <p className="text-gray-500 text-sm">توفير أفضل الأسعار بلا وسطاء.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <Truck className="mx-auto mb-4 text-primary" size={32} />
            <h3 className="font-bold text-lg mb-2">توصيل موثوق</h3>
            <p className="text-gray-500 text-sm">شبكة مندوبي توصيل مرتبطة مباشرة.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <Users className="mx-auto mb-4 text-primary" size={32} />
            <h3 className="font-bold text-lg mb-2">علاقات آمنة</h3>
            <p className="text-gray-500 text-sm">العالم المصغر يحمي بيانات التجار.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
