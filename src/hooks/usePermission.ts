"use client";
import { useUserStore } from "@/lib/stores/userStore";

export function usePermission() {
  const user = useUserStore((state) => state.user);

  const hasPermission = (allowedRoles: string[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return { hasPermission, role: user?.role };
}
