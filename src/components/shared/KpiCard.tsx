import type { ReactNode } from 'react';

type KpiColor = 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'red' | 'gray';

const COLORS: Record<KpiColor, string> = {
  blue:    'bg-blue-50 text-blue-600',
  emerald: 'bg-[#e8f4f0] text-[#2e8b73]',
  amber:   'bg-amber-50 text-amber-600',
  purple:  'bg-purple-50 text-purple-600',
  rose:    'bg-rose-50 text-rose-500',
  red:     'bg-red-50 text-red-600',
  gray:    'bg-gray-50 text-gray-500',
};

export interface KpiCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: KpiColor;
  highlight?: boolean;
  className?: string;
}

export function KpiCard({
  icon,
  label,
  value,
  sub,
  color = 'emerald',
  highlight = false,
  className = '',
}: KpiCardProps) {
  return (
    <div
      className={
        'rounded-2xl border bg-white p-4 transition-all ' +
        (highlight ? 'border-[#2e8b73]/30 shadow-sm' : 'border-gray-100') +
        (className ? ' ' + className : '')
      }
    >
      <div
        className={
          'mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ' +
          COLORS[color]
        }
      >
        {icon}
      </div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-[10px] text-gray-400">{sub}</p>}
    </div>
  );
}
