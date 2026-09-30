import { Topbar } from "@/components/dashboard/Topbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <h1 className="text-4xl font-black mb-2">سياسة الخصوصية</h1>
        <p className="text-sm text-gray-500 mb-8">آخر تحديث: 1 أكتوبر 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            نحن في <strong>جُمْلَتِي</strong> نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.
            توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك.
          </p>

          <h2 className="text-2xl font-bold mt-8">1. المعلومات التي نجمعها</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>الاسم الكامل والبريد الإلكتروني ورقم الهاتف</li>
            <li>اسم النشاط التجاري والعنوان</li>
            <li>بيانات الطلبات والمنتجات</li>
            <li>معلومات الجهاز والمتصفح (لأغراض أمنية)</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">2. كيف نستخدم معلوماتك</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>إتمام الطلبات والتوصيل</li>
            <li>التواصل معك بشأن حسابك</li>
            <li>تحسين خدماتنا</li>
            <li>الالتزام بالمتطلبات القانونية العراقية</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">3. حماية البيانات</h2>
          <p>
            نستخدم تشفير SSL وحماية RLS (Row Level Security) في قاعدة البيانات.
            لا يُسمح لأي مستخدم بالوصول إلى بيانات مستخدم آخر.
          </p>

          <h2 className="text-2xl font-bold mt-8">4. مشاركة البيانات</h2>
          <p>
            <strong>لا نبيع بياناتك لأي طرف ثالث.</strong> نشاركها فقط:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>مع الأطراف المعنية بالطلب (المورد، السوبرماركت، المندوب)</li>
            <li>عند الطلب القانوني من السلطات العراقية</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">5. حقوقك</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>الاطلاع على بياناتك</li>
            <li>تصحيح أي معلومات خاطئة</li>
            <li>حذف حسابك وبياناتك</li>
            <li>الاعتراض على معالجة بياناتك</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">6. ملفات تعريف الارتباط (Cookies)</h2>
          <p>
            نستخدم cookies أساسية فقط لجلسة تسجيل الدخول. لا نستخدم cookies للتتبع أو الإعلانات.
          </p>

          <h2 className="text-2xl font-bold mt-8">7. التعديلات على السياسة</h2>
          <p>
            قد نُحدّث هذه السياسة. سنُخطرك بأي تغييرات مهمة عبر البريد الإلكتروني.
          </p>

          <h2 className="text-2xl font-bold mt-8">8. التواصل</h2>
          <p>
            لأي استفسار: <strong>privacy@jumlati.iq</strong>
          </p>

          <p className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            هذه السياسة متوافقة مع قانون حماية البيانات الشخصية العراقي.
          </p>
        </div>
      </div>
    </div>
  );
}
