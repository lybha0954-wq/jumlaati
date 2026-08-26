'use client';
import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  activeRoute?: string;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {children}
    </div>
  );
};

export default AppLayout;
