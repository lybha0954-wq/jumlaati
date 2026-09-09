// src/app/admin-commissions/components/CommissionSettings.tsx
'use client';

import { useState } from 'react';

interface CommissionRate {
  type: string;
  label: string;
  icon: string;
  rate: number;
}

const defaultRates: CommissionRate[] = [
  { type: 'wholesale', label: 'طلبات الجملة', icon: '🏪', rate: 5 },
  { type: 'retailer', label: 'طلبات المحلات', icon: '🛍️', rate: 3 },
  { type: 'delivery', label: 'طلبات التوصيل', icon: '🚚', rate: 8 },
  { type: 'offer', label: 'طلبات العروض', icon: '🎯', rate: 4 },
  { type: 'nearby', label: 'طلبات الجملة القريبة', icon: '📍', rate: 6 },
];

export default function CommissionSettings() {
  const [rates, setRates] = useState<CommissionRate[]>(defaultRates);
  const [saved, setSaved] = useState(false);

  const handleRateChange = (type: string, value: number) => {
    setRates(prev => prev.map(r => r.type === type ? { ...r, rate: value } : r));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">⚙️ إعدادات نسب العمولات</h2>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            saved
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {saved ? '✅ تم الحفظ' : 'حفظ الإعدادات'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rates.map(rate => (
          <div
            key={rate.type}
            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <span className="text-2xl">{rate.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{rate.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={rate.rate}
                  onChange={e => handleRateChange(rate.type, parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
