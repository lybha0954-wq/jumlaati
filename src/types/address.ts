export interface Address {
  id: string;
  user_id: string;
  title: string;
  city: string;
  district: string;
  street: string;
  is_default: boolean;
  created_at: string;
}

export type AddressInput = Omit<Address, "id" | "user_id" | "created_at">;
