import { Topbar } from "@/components/dashboard/Topbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">الشروط والأحكام</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>باستخدامك منصة جُمْلَتِي، فإنك توافق على جميع الشروط والأحكام التالية:</p>
          <h2 className="text-2xl font-bold">1. الالتزام بالقوانين</h2>
          <p>يجب على جميع التجار والمندوبين الالتزام بالقوانين العراقية المعمول بها.</p>
          <h2 className="text-2xl font-bold">2. الحسابات والمسؤولية</h2>
          <p>أنت مسؤول مسؤولية كاملة عن الحفاظ على سرية بيانات حسابك.</p>
          <h2 className="text-2xl font-bold">3. العمولات والرسوم</h2>
          <p>تحتفظ المنصة بحقها في اقتطاع نسبة عمولة محددة من كل عملية بيع.</p>
          <h2 className="text-2xl font-bold">4. النزاعات</h2>
          <p>يحق لإدارة المنصة التدخل لحل النزاع بشكل عادل.</p>
        </div>
      </div>
    </div>
  );
}
