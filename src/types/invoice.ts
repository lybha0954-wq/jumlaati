export interface InvoiceItem { name: string; qty: number; unit: string; unitPrice: number; }
export interface InvoiceData {
  invoiceNumber: string; date: string; sellerName: string; sellerPhone?: string;
  buyerName: string; buyerStoreName?: string; buyerPhone?: string; buyerAddress?: string;
  items: InvoiceItem[]; notes?: string;
}
