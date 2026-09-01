export type UserRole = "admin" | "delivery" | "retailer" | "wholesaler";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
