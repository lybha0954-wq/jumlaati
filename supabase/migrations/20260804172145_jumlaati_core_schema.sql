-- إنشاء جدول المستخدمين الأساسي
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'retailer' CHECK (role IN ('admin', 'supplier', 'retailer')),
    phone TEXT DEFAULT '',
    business_name TEXT DEFAULT '',
    governorate TEXT DEFAULT '',
    district TEXT DEFAULT '',
    address_details TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- تفعيل الحماية (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- السماح للمستخدم بقراءة وتحديث بياناته فقط
CREATE POLICY "Users manage own profile" 
ON public.user_profiles 
FOR ALL 
TO authenticated 
USING (id = auth.uid()) 
WITH CHECK (id = auth.uid());
-- إنشاء جدول المنتجات
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode TEXT DEFAULT '',
    name TEXT NOT NULL,
    category TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    cost_price BIGINT NOT NULL DEFAULT 0,      -- سعر التكلفة (للمورد)
    final_price BIGINT NOT NULL DEFAULT 0,      -- سعر البيع النهائي
    stock INTEGER NOT NULL DEFAULT 0,           -- الكمية المتوفرة
    min_order_qty INTEGER NOT NULL DEFAULT 1,   -- أقل كمية للطلب بالجملة
    unit TEXT NOT NULL DEFAULT 'قطعة',          -- الوحدة (كرتون، كيس، قطعة)
    status TEXT NOT NULL DEFAULT 'متوفر' CHECK (status IN ('متوفر', 'منخفض', 'نفد', 'موقوف')),
    supplier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL, -- يرتبط بجدول المستخدمين (المورد)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- تفعيل الحماية
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- السماح لأي مستخدم مسجل بقراءة المنتجات
CREATE POLICY "Allow all authenticated to read products" 
ON public.products FOR SELECT 
TO authenticated USING (true);

-- السماح للمورد فقط بإضافة وتعديل وحذف منتجاته
CREATE POLICY "Suppliers manage their own products" 
ON public.products FOR ALL 
TO authenticated 
USING (auth.uid() = supplier_id) 
WITH CHECK (auth.uid() = supplier_id);
