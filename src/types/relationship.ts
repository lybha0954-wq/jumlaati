export interface Relationship {
  id: string;
  retailerId: string;
  supplierId: string;
  status: 'active' | 'pending' | 'blocked';
  createdAt: string;
}
