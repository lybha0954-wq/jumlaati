import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  reviewing: { label: 'قيد المراجعة', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  processing: { label: 'قيد التجهيز', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  assigned: { label: 'تم التعيين', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  shipped: { label: 'تم الشحن', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  delivering: { label: 'مع الموصل', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  out_for_delivery: { label: 'مع الموصل', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  delivered: { label: 'تم التوصيل', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  completed: { label: 'مكتمل', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  cancelled: { label: 'ملغي', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  active: { label: 'نشط', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  inactive: { label: 'غير نشط', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  paid: { label: 'مدفوع', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  unpaid: { label: 'غير مدفوع', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  overdue: { label: 'متأخر', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const config = statusConfig[status] ?? { label: status, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses[size]} ${config.color} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
