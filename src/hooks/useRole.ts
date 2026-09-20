'use client';

import { useAuth, type UserRole } from '@/contexts/AuthContext';

export function useRole() {
  const { role, user, profile, loading } = useAuth();
  return {
    role,
    user,
    profile,
    loading,
    isRetailer: role === 'retailer',
    isSupplier: role === 'supplier',
    isAdmin: role === 'admin',
    isDelivery: role === 'delivery',
    isOwner: role === 'owner',
    hasRole: (requiredRole: UserRole) => role === requiredRole,
  };
}
