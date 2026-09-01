export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  wholesalePrice: number;
  stock: number;
  category: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
}

export type ProductInput = Omit<Product, "id" | "createdAt">;
