import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  size?: 'default' | 'hero';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border-border',
  success: 'bg-green-50 border-green-200',
  warning: 'bg-amber-50 border-amber-200',
  danger: 'bg-red-50 border-red-200',
  primary: 'bg-primary border-primary/20 text-primary-foreground',
};

const trendIconMap = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColorMap = {
  up: 'text-green-600',
  down: 'text-red-500',
  neutral: 'text-muted-foreground',
};

export default function MetricCard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  icon,
  variant = 'default',
  size = 'default',
  className = '',
}: MetricCardProps) {
  const TrendIcon = trend ? trendIconMap[trend] : null;
  const trendColor = trend ? trendColorMap[trend] : '';
  const isPrimary = variant === 'primary';

  return (
    <div
      className={`
        relative rounded-xl border p-4 card-hover
        ${variantStyles[variant]}
        ${size === 'hero' ? 'p-6' : 'p-4'}
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs font-semibold uppercase tracking-wide font-arabic ${isPrimary ? 'text-white/70' : 'text-muted-foreground'}`}>
          {label}
        </p>
        <div className={`rounded-lg p-2 ${isPrimary ? 'bg-white/15' : 'bg-muted'}`}>
          {icon}
        </div>
      </div>
      <p className={`tabular-nums font-bold ${size === 'hero' ? 'text-3xl' : 'text-2xl'} ${isPrimary ? 'text-white' : 'text-foreground'}`}>
        {value}
      </p>
      {subValue && (
        <p className={`text-xs font-arabic mt-0.5 ${isPrimary ? 'text-white/60' : 'text-muted-foreground'}`}>
          {subValue}
        </p>
      )}
      {trend && trendValue && TrendIcon && (
        <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
          <TrendIcon size={13} />
          <span className="text-xs font-semibold tabular-nums font-arabic">{trendValue}</span>
        </div>
      )}
    </div>
  );
}