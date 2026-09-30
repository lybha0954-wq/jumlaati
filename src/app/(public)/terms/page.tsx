import { Topbar } from "@/components/dashboard/Topbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <h1 className="text-4xl font-black mb-2">الشروط والأحكام</h1>
        <p className="text-sm text-gray-500 mb-8">آخر تحديث: 1 أكتوبر 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            مرحباً بك في <strong>جُمْلَتِي</strong>. باستخدامك للمنصة فإنك توافق على
            الشروط والأحكام التالية. يُرجى قراءتها بعناية.
          </p>

          <h2 className="text-2xl font-bold mt-8">1. قبول الشروط</h2>
          <p>
            باستخدام المنصة (تطبيق أو موقع)، فإنك تُقرّ بأنك قرأت وفهمت ووافقت
            على هذه الشروط. إذا لم توافق، يُرجى عدم استخدام المنصة.
          </p>

          <h2 className="text-2xl font-bold mt-8">2. التسجيل والحساب</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>يجب تقديم معلومات صحيحة وكاملة عند التسجيل</li>
            <li>أنت مسؤول عن سرية بيانات حسابك وكلمة السر</li>
            <li>لا يجوز استخدام حساب واحد لأكثر من شخص</li>
            <li>للمنصة حق رفض أو إلغاء أي حساب دون إشعار</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">3. الأدوار والصلاحيات</h2>
          <p>المنصة تعمل بأربعة أدوار:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>السوبرماركت:</strong> يطلب المنتجات من تجار الجملة</li>
            <li><strong>تاجر الجملة:</strong> يعرض المنتجات ويدير الطلبات</li>
            <li><strong>المندوب:</strong> يوصّل الطلبات</li>
            <li><strong>الإدارة:</strong> تشرف على النظام</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">4. العمولات والرسوم</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>عمولة المنصة على تاجر الجملة: 1% من قيمة الطلب</li>
            <li>رسوم التوصيل: 3000 دينار عراقي لكل طلب</li>
            <li>السوبرماركت: مجاني تماماً</li>
            <li>يحق للمنصة تعديل الرسوم مع إشعار مسبق</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">5. مسؤوليات المستخدم</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>الالتزام بالقوانين العراقية المعمول بها</li>
            <li>عدم استخدام المنصة لأي غرض غير قانوني</li>
            <li>عدم نشر محتوى مسيء أو مضلل</li>
            <li>دقة المنتجات والكميات المعلنة</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">6. الطلبات والتسليم</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>الطلب يُلزم الطرفين بعد القبول</li>
            <li>يمكن إلغاء الطلب قبل قبول المورد</li>
            <li>بعد القبول: يُتبع سياسة الاسترداد</li>
            <li>المنصة وسيط — لا نتحمل مسؤولية جودة المنتجات</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">7. حل النزاعات</h2>
          <p>
            في حال نشوء نزاع بين الأطراف، يتدخل فريق الدعم للوساطة.
            القرار النهائي يعود للطرفين أو للجهات القانونية المختصة.
          </p>

          <h2 className="text-2xl font-bold mt-8">8. إيقاف الخدمة</h2>
          <p>
            للمنصة الحق في تعليق أو إيقاف أي حساب يخالف هذه الشروط،
            دون إشعار مسبق وفي حالات المخالفات الجسيمة.
          </p>

          <h2 className="text-2xl font-bold mt-8">9. حدود المسؤولية</h2>
          <p>
            المنصة وسيط تقني بين الأطراف. لا نتحمل مسؤولية:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>جودة المنتجات المُسلَّمة</li>
            <li>الالتزام بمواعيد التسليم</li>
            <li>النزاعات المالية بين الأطراف</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">10. تعديل الشروط</h2>
          <p>
            يحق للمنصة تحديث هذه الشروط. سيتم إشعار المستخدمين بأي تغييرات
            مهمة عبر البريد الإلكتروني أو التطبيق قبل 7 أيام من التطبيق.
          </p>

          <h2 className="text-2xl font-bold mt-8">11. القانون المُطبَّق</h2>
          <p>
            تخضع هذه الشروط للقوانين العراقية. أي نزاع يُحلّ أمام
            المحاكم المختصة في كربلاء المقدسة.
          </p>

          <h2 className="text-2xl font-bold mt-8">12. التواصل</h2>
          <p>
            لأي استفسار حول هذه الشروط: <strong>legal@jumlati.iq</strong>
          </p>

          <p className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            باستخدامك للمنصة تُقرّ بموافقتك الكاملة على هذه الشروط.
          </p>
        </div>
      </div>
    </div>
  );
}
