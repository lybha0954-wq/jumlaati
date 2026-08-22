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
