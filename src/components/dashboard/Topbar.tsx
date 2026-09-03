"use client";

import React, { useEffect } from 'react';
import { useUserStore } from "@/lib/stores/userStore";
import { useNotificationStore } from "@/hooks/useNotification";

export function Topbar() {
  const user = useUserStore((state) => state?.user);
  const unreadCount = useNotificationStore((state) => state?.unreadCount);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="font-semibold text-lg">مرحباً، {user?.name || "زائر"}</div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <span className="text-xl">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">{unreadCount}</span>
          )}
        </button>
        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
          {user?.name?.charAt(0) || "U"}
        </div>
      </div>
    </header>
  );
}

const Header: React.FC = () => {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.warn('Placeholder: Header is not implemented yet.');
  }, []);
  return (
    <div>
      {/* Header placeholder */}
    </div>
  );
};

export default Header;
