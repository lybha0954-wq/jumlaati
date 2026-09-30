import { Topbar } from "@/components/dashboard/Topbar";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <h1 className="text-4xl font-black mb-2">سياسة الاسترداد</h1>
        <p className="text-sm text-gray-500 mb-8">آخر تحديث: 1 أكتوبر 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            نهدف في <strong>جُمْلَتِي</strong> إلى ضمان رضا جميع الأطراف.
            توضح هذه السياسة شروط وأحكام الاسترداد والإرجاع.
          </p>

          <h2 className="text-2xl font-bold mt-8">1. حالات الاسترداد الكامل</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>عدم تسليم الطلب خلال 7 أيام من تاريخ القبول</li>
            <li>وصول منتجات مخالفة للمواصفات المذكورة</li>
            <li>منتجات تالفة أو منتهية الصلاحية</li>
            <li>خطأ في الكمية المُسلّمة</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">2. حالات الاسترداد الجزئي</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>جزء من الطلب فقط غير مطابق</li>
            <li>تأخير في التسليم مع موافقة السوبرماركت</li>
            <li>خصم متفق عليه بين الطرفين</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">3. مدة تقديم الطلب</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>خلال 48 ساعة من استلام الطلب</li>
            <li>مع إرفاق صور للمنتج المُشكَل منه</li>
            <li>عبر التطبيق أو الدعم الفني</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">4. آلية المعالجة</h2>
          <p>عند تقديم طلب استرداد:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>يستلم الطلب فريق الدعم خلال 24 ساعة</li>
            <li>يتم التواصل مع الطرف المعني (مورد/مندوب)</li>
            <li>يُبتّ في الطلب خلال 3-5 أيام عمل</li>
            <li>في حال الموافقة: يُعاد المبلغ خلال 7 أيام</li>
          </ol>

          <h2 className="text-2xl font-bold mt-8">5. طرق الاسترداد</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>دفع عند الاستلام: نقدي أو أرصدة</li>
            <li>زين كاش / فاست باي: على المحفظة الإلكترونية</li>
            <li>حوالة بنكية: خلال 3-5 أيام</li>
            <li>رصيد داخل المنصة: فوري</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">6. رسوم الاسترداد</h2>
          <p>
            في الحالات المشروعة: <strong>لا توجد رسوم</strong>.
            في حالات الخطأ من العميل: قد تُطبَّق رسوم توصيل.
          </p>

          <h2 className="text-2xl font-bold mt-8">7. الاستثناءات</h2>
          <p>لا يمكن استرداد:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>المنتجات الغذائية بعد فتحها</li>
            <li>المنتجات المخصصة حسب الطلب</li>
            <li>بعد 48 ساعة من الاستلام</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">8. التواصل</h2>
          <p>
            للاستفسار: <strong>support@jumlati.iq</strong>
            <br />
            أو من خلال التطبيق: قسم الدعم الفني
          </p>

          <p className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            نحتفظ بحق تعديل هذه السياسة مع الإشعار المسبق للمستخدمين.
          </p>
        </div>
      </div>
    </div>
  );
}
