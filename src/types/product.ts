export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  costPrice: number;
  originalPrice: number;
  finalPrice: number;
  stock: number;
  minOrderQty: number;
  status: 'متوفر' | 'منخفض' | 'نفد' | 'موقوف';
  unit: string;
  supplierId?: string;
  supplierName?: string;
  supplierRating?: number;
  deliveryDays?: number;
}
