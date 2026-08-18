export type UserRole = 'admin' | 'supplier' | 'retailer';
export type ProductStatus = 'متوفر' | 'منخفض' | 'نفد' | 'موقوف';
export type StoreStatus = 'active' | 'pending' | 'suspended';
export type OrderStatus = 'reviewing' | 'delivering' | 'completed' | 'cancelled';
export type SupplierOrderStatus = 'pending' | 'ready' | 'shipped';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type LedgerEntryType = 'order' | 'payment' | 'adjustment';
export type LedgerDirection = 'debit' | 'credit';
export type LedgerStatus = 'completed' | 'pending' | 'overdue';
export type CreditStatus = 'good' | 'warning' | 'overdue';
export type Currency = 'IQD';
export type Numeric = string;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string;
          avatar_url?: string;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          region: string;
          rating: Numeric;
          phone: string;
          email: string;
          is_active: boolean;
          credit_limit: number;
          credit_used: number;
          pending_debt: number;
          due_days: number;
          credit_status: CreditStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          region?: string;
          rating?: Numeric;
          phone?: string;
          email?: string;
          is_active?: boolean;
          credit_limit?: number;
          credit_used?: number;
          pending_debt?: number;
          due_days?: number;
          credit_status?: CreditStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          region?: string;
          rating?: Numeric;
          phone?: string;
          email?: string;
          is_active?: boolean;
          credit_limit?: number;
          credit_used?: number;
          pending_debt?: number;
          due_days?: number;
          credit_status?: CreditStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          name: string;
          owner: string;
          phone: string;
          city: string;
          status: StoreStatus;
          join_date: string;
          total_orders: number;
          total_spent: number;
          credit_limit: number;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner?: string;
          phone?: string;
          city?: string;
          status?: StoreStatus;
          join_date?: string;
          total_orders?: number;
          total_spent?: number;
          credit_limit?: number;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner?: string;
          phone?: string;
          city?: string;
          status?: StoreStatus;
          join_date?: string;
          total_orders?: number;
          total_spent?: number;
          credit_limit?: number;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          barcode: string;
          name: string;
          category: string;
          cost_price: number;
          original_price: number;
          final_price: number;
          stock: number;
          min_order_qty: number;
          status: ProductStatus;
          unit: string;
          supplier_id: string | null;
          supplier_name: string;
          supplier_rating: Numeric;
          delivery_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barcode?: string;
          name: string;
          category?: string;
          cost_price?: number;
          original_price?: number;
          final_price?: number;
          stock?: number;
          min_order_qty?: number;
          status?: ProductStatus;
          unit?: string;
          supplier_id?: string | null;
          supplier_name?: string;
          supplier_rating?: Numeric;
          delivery_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          barcode?: string;
          name?: string;
          category?: string;
          cost_price?: number;
          original_price?: number;
          final_price?: number;
          stock?: number;
          min_order_qty?: number;
          status?: ProductStatus;
          unit?: string;
          supplier_id?: string | null;
          supplier_name?: string;
          supplier_rating?: Numeric;
          delivery_days?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          placed_at: string;
          status: OrderStatus;
          payment_status: PaymentStatus;
          buyer_name: string;
          buyer_store_name: string;
          buyer_phone: string;
          delivery_address: string;
          delivery_city: string;
          delivery_notes: string;
          subtotal: number;
          delivery_fee: number;
          total: number;
          commission: number;
          payment_method: string;
          store_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          placed_at?: string;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          buyer_name?: string;
          buyer_store_name?: string;
          buyer_phone?: string;
          delivery_address?: string;
          delivery_city?: string;
          delivery_notes?: string;
          subtotal?: number;
          delivery_fee?: number;
          total?: number;
          commission?: number;
          payment_method?: string;
          store_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          placed_at?: string;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          buyer_name?: string;
          buyer_store_name?: string;
          buyer_phone?: string;
          delivery_address?: string;
          delivery_city?: string;
          delivery_notes?: string;
          subtotal?: number;
          delivery_fee?: number;
          total?: number;
          commission?: number;
          payment_method?: string;
          store_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          name: string;
          qty: number;
          unit: string;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          name: string;
          qty?: number;
          unit?: string;
          unit_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          name?: string;
          qty?: number;
          unit?: string;
          unit_price?: number;
          created_at?: string;
        };
      };
      supplier_orders: {
        Row: {
          id: string;
          order_number: string;
          placed_at: string;
          status: SupplierOrderStatus;
          payment_status: PaymentStatus;
          customer_name: string;
          customer_store_name: string;
          customer_phone: string;
          delivery_address: string;
          delivery_city: string;
          delivery_notes: string;
          total: number;
          supplier_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          placed_at?: string;
          status?: SupplierOrderStatus;
          payment_status?: PaymentStatus;
          customer_name?: string;
          customer_store_name?: string;
          customer_phone?: string;
          delivery_address?: string;
          delivery_city?: string;
          delivery_notes?: string;
          total?: number;
          supplier_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          placed_at?: string;
          status?: SupplierOrderStatus;
          payment_status?: PaymentStatus;
          customer_name?: string;
          customer_store_name?: string;
          customer_phone?: string;
          delivery_address?: string;
          delivery_city?: string;
          delivery_notes?: string;
          total?: number;
          supplier_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      supplier_order_items: {
        Row: {
          id: string;
          supplier_order_id: string;
          product_id: string | null;
          name: string;
          qty: number;
          unit: string;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          supplier_order_id: string;
          product_id?: string | null;
          name: string;
          qty?: number;
          unit?: string;
          unit_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          supplier_order_id?: string;
          product_id?: string | null;
          name?: string;
          qty?: number;
          unit?: string;
          unit_price?: number;
          created_at?: string;
        };
      };
      commissions: {
        Row: {
          id: string;
          order_id: string;
          order_date: string;
          retailer_name: string;
          order_total: number;
          commission: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          order_date?: string;
          retailer_name?: string;
          order_total: number;
          commission: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          order_date?: string;
          retailer_name?: string;
          order_total?: number;
          commission?: number;
          created_at?: string;
        };
      };
      ledger_entries: {
        Row: {
          id: string;
          entry_date: string;
          supplier_id: string;
          supplier_name: string;
          entry_type: LedgerEntryType;
          description: string;
          amount: number;
          direction: LedgerDirection;
          balance: number;
          order_id: string;
          payment_method: string;
          status: LedgerStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          entry_date?: string;
          supplier_id: string;
          supplier_name: string;
          entry_type?: LedgerEntryType;
          description?: string;
          amount: number;
          direction?: LedgerDirection;
          balance?: number;
          order_id?: string;
          payment_method?: string;
          status?: LedgerStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          entry_date?: string;
          supplier_id?: string;
          supplier_name?: string;
          entry_type?: LedgerEntryType;
          description?: string;
          amount?: number;
          direction?: LedgerDirection;
          balance?: number;
          order_id?: string;
          payment_method?: string;
          status?: LedgerStatus;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          transaction_number: string;
          retailer_id: string | null;
          supplier_id: string | null;
          order_id: string | null;
          invoice_id: string | null;
          total_amount: number;
          paid_amount: number;
          remaining_amount: number;
          currency: string;
          payment_status: PaymentStatus;
          payment_method: string;
          due_date: string | null;
          paid_at: string | null;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          transaction_number: string;
          retailer_id?: string | null;
          supplier_id?: string | null;
          order_id?: string | null;
          invoice_id?: string | null;
          total_amount?: number;
          paid_amount?: number;
          currency?: string;
          payment_status?: PaymentStatus;
          payment_method?: string;
          due_date?: string | null;
          paid_at?: string | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          transaction_number?: string;
          retailer_id?: string | null;
          supplier_id?: string | null;
          order_id?: string | null;
          invoice_id?: string | null;
          total_amount?: number;
          paid_amount?: number;
          currency?: string;
          payment_status?: PaymentStatus;
          payment_method?: string;
          due_date?: string | null;
          paid_at?: string | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title_ar: string;
          title_en: string;
          message_ar: string;
          message_en: string;
          type: string;
          is_read: boolean;
          link_url: string;
          role_target: 'admin' | 'supplier' | 'retailer' | 'all';
          data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title_ar: string;
          title_en: string;
          message_ar: string;
          message_en: string;
          type: string;
          is_read?: boolean;
          link_url?: string;
          role_target?: 'admin' | 'supplier' | 'retailer' | 'all';
          data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title_ar?: string;
          title_en?: string;
          message_ar?: string;
          message_en?: string;
          type?: string;
          is_read?: boolean;
          link_url?: string;
          role_target?: 'admin' | 'supplier' | 'retailer' | 'all';
          data?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in string]: never;
    };
    Functions: {
      [_ in string]: never;
    };
    Enums: {
      [_ in string]: never;
    };
    CompositeTypes: {
      [_ in string]: never;
    };
  };
};