'use client';
import React from 'react';

interface MetricCardProps {
  label?: string;
  value?: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'warning' | 'danger' | 'success';
  size?: 'default' | 'hero';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-card border-border',
  primary: 'bg-primary/10 border-primary/30',
  warning: 'bg-amber-500/10 border-amber-500/30',
  danger: 'bg-red-500/10 border-red-500/30',
  success: 'bg-emerald-500/10 border-emerald-500/30',
};

const trendColors: Record<string, string> = {
  up: 'text-emerald-500',
  down: 'text-red-500',
  neutral: 'text-muted-foreground',
};

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  trend = 'neutral',
  trendValue,
  icon,
  variant = 'default',
  size = 'default',
  className = '',
}) => {
  const isHero = size === 'hero';

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-2 ${variantStyles[variant] ?? variantStyles.default} ${isHero ? 'p-6' : ''} ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-muted-foreground font-medium ${isHero ? 'text-base' : 'text-sm'}`}>
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <div className={`font-bold text-foreground ${isHero ? 'text-3xl' : 'text-2xl'}`}>
        {value ?? '—'}
      </div>
      {subValue && (
        <div className="text-xs text-muted-foreground">{subValue}</div>
      )}
      {trendValue && (
        <div className={`text-xs font-medium ${trendColors[trend] ?? trendColors.neutral}`}>
          {trendValue}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
