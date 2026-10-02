/**
 * حالة الطلب — موحّد لكل الصفحات
 */
export interface StatusInfo {
  label: string;
  className: string;
}

export const ORDER_STATUS_MAP: Record<string, StatusInfo> = {
  pending:   { label: 'جديد',            className: 'bg-amber-50 text-amber-700' },
  accepted:  { label: 'مقبول',           className: 'bg-blue-50 text-blue-700' },
  shipped:   { label: 'قيد التوصيل',     className: 'bg-purple-50 text-purple-700' },
  picked_up: { label: 'مع المندوب',      className: 'bg-indigo-50 text-indigo-700' },
  delivered: { label: 'تم التسليم',      className: 'bg-[#e8f4f0] text-[#1e6b57]' },
  cancelled: { label: 'ملغي',            className: 'bg-red-50 text-red-700' },
};

export function getStatusInfo(status: string): StatusInfo {
  return ORDER_STATUS_MAP[status] || { label: status, className: 'bg-gray-50 text-gray-600' };
}

export const PAYMENT_STATUS_MAP: Record<string, StatusInfo> = {
  unpaid:   { label: 'غير مدفوع', className: 'bg-red-50 text-red-700' },
  partial:  { label: 'جزئي',       className: 'bg-amber-50 text-amber-700' },
  paid:     { label: 'مدفوع',      className: 'bg-[#e8f4f0] text-[#1e6b57]' },
  refunded: { label: 'مسترجع',     className: 'bg-gray-100 text-gray-600' },
};

export function getPaymentStatusInfo(status: string): StatusInfo {
  return PAYMENT_STATUS_MAP[status] || { label: status, className: 'bg-gray-50 text-gray-600' };
}
