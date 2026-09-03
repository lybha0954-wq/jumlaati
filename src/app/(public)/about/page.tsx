import { Topbar } from "@/components/dashboard/Topbar";

export default function AboutPage() {
  return (
    <div>
      <Topbar />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">عن جملا</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          جملا هي منصة عراقية متكاملة تهدف إلى ربط تجار التجزئة مع تجار الجملة والموردين المحليين بطريقة سهلة وآمنة، مما يوفر أفضل الأسعار ويوفر الوقت والجهد لجميع الأطراف.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          نؤمن بأن التجارة الإلكترونية في العراق تحتاج إلى بنية تحتية موثوقة وقابلة للتوسع، ونحن نعمل يومياً لتحقيق ذلك عبر أدوات تحليلية متقدمة وإدارة مخزون ذكية.
        </p>
      </div>
    </div>
  );
}
