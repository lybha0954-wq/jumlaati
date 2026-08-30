'use client';
; // يجب أن يكون Client Component

export default function OrderError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-red-600">حدث خطأ في تحميل الطلب</h2>
      <p className="text-gray-500 mb-4">{error.message || 'حاول مرة أخرى'}</p>
      <button onClick={reset} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        إعادة المحاولة
      </button>
    </div>
  );
}
