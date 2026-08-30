import AdminCountersContent from './components/AdminCountersContent';

export default function Page() {
  return <AdminCountersContent />;
}
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminCouponsPage() {
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: '0',
    max_discount: '',
    expires_at: '',
    usage_limit: '1',
  });
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('coupons').insert({
      code: form.code.toUpperCase().trim(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      min_order_amount: parseFloat(form.min_order_amount),
      max_discount: form.max_discount ? parseFloat(form.max_discount) : null,
      expires_at: new Date(form.expires_at).toISOString(),
      usage_limit: parseInt(form.usage_limit),
      active: true,
    });

    if (error) {
      alert('فشل إنشاء الكوبون: ' + error.message);
    } else {
      alert('✅ تم إنشاء الكوبون بنجاح!');
      setForm({ ...form, code: '', discount_value: '', expires_at: '' });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🎟️ إدارة الكوبونات الترويجية</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">كود الكوبون (سيظهر للعملاء)</label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="مثال: SUMMER25"
            className="w-full p-3 border rounded-lg"
            required
            dir="ltr"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">نوع الخصم</label>
            <select
              value={form.discount_type}
              onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="percentage">نسبة مئوية (%)</option>
              <option value="fixed">مبلغ ثابت (ريال)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">قيمة الخصم</label>
            <input
              type="number"
              value={form.discount_value}
              onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
              placeholder="مثال: 25"
              className="w-full p-3 border rounded-lg"
              required
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">الحد الأدنى للطلب</label>
            <input
              type="number"
              value={form.min_order_amount}
              onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
              placeholder="مثال: 100"
              className="w-full p-3 border rounded-lg"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الحد الأقصى للخصم (اختياري)</label>
            <input
              type="number"
              value={form.max_discount}
              onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
              placeholder="مثال: 50"
              className="w-full p-3 border rounded-lg"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">تاريخ الانتهاء</label>
            <input
              type="datetime-local"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">عدد مرات الاستخدام</label>
            <input
              type="number"
              value={form.usage_limit}
              onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
              className="w-full p-3 border rounded-lg"
              min="1"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'جاري الإنشاء...' : '➕ إنشاء كوبون جديد'}
        </button>
      </form>

      <div className="mt-8 text-sm text-gray-500">
        <p>📌 ملاحظات:</p>
        <ul className="list-disc mr-6 space-y-1">
          <li>الكوبونات من نوع {`"نسبة مئوية"`} تُطبق على إجمالي الطلب قبل الخصم.</li>
          <li>يمكن تحديد حد أقصى للخصم لمنع الخصم الزائد عن الحد.</li>
          <li>سيظهر الكوبون للعملاء في صفحة السلة عند إدخال الكود.</li>
        </ul>
      </div>
    </div>
  );
}
