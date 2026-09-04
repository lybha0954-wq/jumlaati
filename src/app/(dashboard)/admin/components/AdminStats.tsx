'use client';

import React from 'react';

interface AdminStatsProps {
  title?: string;
  value?: string | number;
  icon?: string;
  [key: string]: unknown;
}

const AdminStats = ({ title, value, icon }: AdminStatsProps) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow flex items-center gap-4">
      {icon && <span className="text-3xl">{icon}</span>}
      <div>
        {title && <p className="text-sm text-gray-500">{title}</p>}
        {value !== undefined && <p className="text-xl font-bold">{value}</p>}
      </div>
    </div>
  );
};

export { AdminStats };
