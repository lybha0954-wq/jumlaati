import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
        {icon || <PackageOpen size={28} />}
      </div>
      <h3 className="font-arabic font-semibold text-base text-foreground mb-2">{title}</h3>
      {description && (
        <p className="font-arabic text-sm text-muted-foreground max-w-xs leading-relaxed mb-4">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}