-- جدول تفاصيل الطلب (المنتجات التي اشتراها التاجر داخل الطلب)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1,
    unit TEXT NOT NULL DEFAULT 'قطعة',
    unit_price BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- تفعيل الحماية
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- السماح للأطراف المعنية بالاطلاع على تفاصيل الطلب
CREATE POLICY "Order items access" 
ON public.order_items FOR SELECT 
TO authenticated USING (true);

-- إدارة التفاصيل (للمورد)
CREATE POLICY "Suppliers manage order items" 
ON public.order_items FOR ALL 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_id AND orders.supplier_id = auth.uid()));
