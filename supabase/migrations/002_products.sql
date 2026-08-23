-- جدول المنتجات (يضيفه المورد)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode TEXT DEFAULT '',
    name TEXT NOT NULL,
    category TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    cost_price BIGINT NOT NULL DEFAULT 0,
    final_price BIGINT NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    min_order_qty INTEGER NOT NULL DEFAULT 1,
    unit TEXT NOT NULL DEFAULT 'قطعة',
    status TEXT NOT NULL DEFAULT 'متوفر' CHECK (status IN ('متوفر', 'منخفض', 'نفد', 'موقوف')),
    supplier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- تفعيل الحماية
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- أي مستخدم مسجل يشاهد المنتجات
CREATE POLICY "Allow all authenticated to read products" 
ON public.products FOR SELECT 
TO authenticated USING (true);

-- المورد يدير منتجاته فقط
CREATE POLICY "Suppliers manage their own products" 
ON public.products FOR ALL 
TO authenticated 
USING (auth.uid() = supplier_id) 
WITH CHECK (auth.uid() = supplier_id);
