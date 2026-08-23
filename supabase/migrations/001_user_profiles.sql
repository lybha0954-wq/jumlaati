-- جدول المستخدمين الموحد (أدمن، مورد، تاجر، موصل)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'retailer' CHECK (role IN ('admin', 'supplier', 'retailer', 'courier')),
    phone TEXT DEFAULT '',
    business_name TEXT DEFAULT '',
    governorate TEXT DEFAULT '',
    district TEXT DEFAULT '',
    address_details TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    
    -- ربط الموصل بالمورد الذي يعمل لديه
    employer_supplier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    
    -- حالة الموصل اليدوية (يضغطها الموصل في تطبيقه)
    courier_status TEXT DEFAULT 'متواجد' CHECK (courier_status IN ('متواجد', 'مشغول', 'غائب')),
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- تفعيل الحماية
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- المستخدم يدير ملفه، والمورد يقرأ ملفات موصليه
CREATE POLICY "Users manage own profile" 
ON public.user_profiles FOR ALL 
TO authenticated 
USING (id = auth.uid() OR employer_supplier_id = auth.uid()) 
WITH CHECK (id = auth.uid());
