import { useAuth } from '@/contexts/AuthContext';
export function useRole() { return useAuth().role; }
