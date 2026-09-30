"use client";

import { useUserStore } from "@/lib/stores/userStore";
import { Sidebar } from "./Sidebar";
import { BottomNavBar } from "@/components/shared/BottomNavBar";

export const SIDEBAR_ROLES = ["admin", "supplier"];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const role = useUserStore((s) => s.user?.role);
  const hasSidebar = role ? SIDEBAR_ROLES.includes(role) : false;

  return (
    <div className="min-h-screen bg-gray-50">
      {hasSidebar && <Sidebar />}
      <div className={hasSidebar ? "md:mr-64 pb-16 md:pb-0" : "pb-16"}>
        {children}
      </div>
      <BottomNavBar />
    </div>
  );
}
