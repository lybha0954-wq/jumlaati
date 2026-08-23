-- جدول الطلبات (مع التكليف المباشر للموصل)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'reviewing' CHECK (status IN ('reviewing', 'assigned', 'delivering', 'completed', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'overdue')),
    
    -- الأطراف الثلاثة
    retailer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    supplier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    courier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    
    -- بيانات التكليف والتوصيل
    assigned_at TIMESTAMPTZ DEFAULT NULL,
    delivery_address TEXT DEFAULT '',
    delivery_city TEXT DEFAULT '',
    delivery_notes TEXT DEFAULT '',
    delivery_fee BIGINT DEFAULT 0,
    
    -- إحداثيات المتجر (لتوجيه الموصل عبر الخريطة)
    store_lat DOUBLE PRECISION DEFAULT NULL,
    store_lng DOUBLE PRECISION DEFAULT NULL,

    -- الحسابات المالية
    subtotal BIGINT DEFAULT 0,
    total BIGINT DEFAULT 0,
    commission BIGINT DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- تفعيل الحماية
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- المورد يدير الطلبات ويكلف الموصل
CREATE POLICY "Supplier manages orders" 
ON public.orders FOR ALL 
TO authenticated 
USING (supplier_id = auth.uid()) 
WITH CHECK (supplier_id = auth.uid());

-- التاجر يشاهد طلباته
CREATE POLICY "Retailer views orders" 
ON public.orders FOR SELECT 
TO authenticated 
USING (retailer_id = auth.uid());

-- الموصل يشاهد الطلبات المكلف بها فقط
CREATE POLICY "Courier views assigned orders" 
ON public.orders FOR SELECT 
TO authenticated 
USING (courier_id = auth.uid());
