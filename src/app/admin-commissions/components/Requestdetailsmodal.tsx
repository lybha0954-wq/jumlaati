// src/app/admin-commissions/components/RequestDetailsModal.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Request {
  id: string;
  type: 'wholesale' | 'retailer' | 'delivery' | 'offer' | 'nearby';
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  requester: { full_name: string; role: string; phone: string };
  target: { full_name: string; role: string; phone: string };
  commission_percentage: number;
  commission_amount: number;
  description: string;
  created_at: string;
  updated_at: string;
}

interface RequestDetailsModalProps {
  request: Request;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  wholesale: 'طلب جملة',
  retailer: 'طلب محل/سوبرماركت',
  delivery: 'طلب توصيل',
  offer: 'طلب عرض منتجات',
  nearby: 'طلب جملة قريبة',
};

export default function RequestDetailsModal({ request, isOpen, onClose, onUpdate }: RequestDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(request.status);
  const supabase = createClient();

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy hh:mm a', { locale: ar });
    } catch {
      return date;
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (loading || newStatus === status) return;

    setLoading(true);
    const { error } = await supabase
      .from('commission_requests')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', request.id);

    if (error) {
      alert('فشل تحديث الحالة: ' + error.message);
    } else {
      setStatus(newStatus);
      onUpdate();
      // إغلاق النافذة بعد التحديث
      setTimeout(onClose, 500);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* رأس النافذة */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            📋 تفاصيل الطلب
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* محتوى النافذة */}
        <div className="p-6 space-y-4">
          {/* معلومات أساسية */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">نوع الطلب</p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {TYPE_LABELS[request.type] || request.type}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">الحالة الحالية</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                status === 'approved' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {status === 'pending' ? 'قيد الانتظار' :
                 status === 'approved' ? 'مقبولة' :
                 status === 'completed' ? 'مكتملة' : 'مرفوضة'}
              </span>
            </div>
          </div>

          {/* مقدم الطلب والهدف */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700 pt-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">مقدم الطلب</p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {request.requester?.full_name || 'غير محدد'}
              </p>
              <p className="text-sm text-gray-500">{request.requester?.role || ''}</p>
              <p className="text-sm text-gray-500">📱 {request.requester?.phone || ''}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">الهدف</p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {request.target?.full_name || 'غير محدد'}
              </p>
              <p className="text-sm text-gray-500">{request.target?.role || ''}</p>
              <p className="text-sm text-gray-500">📱 {request.target?.phone || ''}</p>
            </div>
          </div>

          {/* العمولة */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700 pt-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">نسبة العمولة</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {request.commission_percentage || 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">قيمة العمولة</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {request.commission_amount?.toFixed(2) || 0} د.ع
              </p>
            </div>
          </div>

          {/* الوصف */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">الوصف</p>
            <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mt-1">
              {request.description || 'لا يوجد وصف'}
            </p>
          </div>

          {/* التواريخ */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700 pt-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">تاريخ الإنشاء</p>
              <p className="text-gray-700 dark:text-gray-300">{formatDate(request.created_at)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">آخر تحديث</p>
              <p className="text-gray-700 dark:text-gray-300">{formatDate(request.updated_at)}</p>
            </div>
          </div>

          {/* أزرار الإجراء */}
          {status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleStatusChange('approved')}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading ? 'جاري...' : '✅ قبول الطلب'}
              </button>
              <button
                onClick={() => handleStatusChange('rejected')}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading ? 'جاري...' : '❌ رفض الطلب'}
              </button>
            </div>
          )}
          {status === 'approved' && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading ? 'جاري...' : '✅ تم الإنجاز'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
