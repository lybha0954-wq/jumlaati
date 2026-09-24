export type UserRole = 'admin' | 'supplier' | 'retailer' | 'delivery';
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  business_name?: string;
  governorate?: string;
  district?: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
}
