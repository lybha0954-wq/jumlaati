import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
          <Link href="/privacy" className="font-bold text-gray-600 hover:text-[#2e8b73]">
            سياسة الخصوصية
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/terms" className="font-bold text-gray-600 hover:text-[#2e8b73]">
            الشروط والأحكام
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/refund-policy" className="font-bold text-gray-600 hover:text-[#2e8b73]">
            سياسة الاسترداد
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/contact" className="font-bold text-gray-600 hover:text-[#2e8b73]">
            تواصل معنا
          </Link>
        </div>
        <p className="text-center text-[11px] text-gray-400">
          © {year} جُمْلَتِي — جميع الحقوق محفوظة
        </p>
        <p className="mt-1 text-center text-[10px] text-gray-300">
          بُني بـ ❤️ في العراق
        </p>
      </div>
    </footer>
  );
}
