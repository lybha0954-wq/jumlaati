-- ============================================================
-- 001_schema.sql — ENUMs + Core Tables
-- ============================================================

CREATE TYPE public.user_role AS ENUM ('owner','admin','supplier','retailer','delivery');
CREATE TYPE public.product_status AS ENUM ('متوفر','منخفض','نفد','موقوف');
CREATE TYPE public.store_status AS ENUM ('active','pending','suspended');
CREATE TYPE public.order_status AS ENUM ('reviewing','delivering','completed','cancelled');
CREATE TYPE public.supplier_order_status AS ENUM ('pending','ready','shipped');
CREATE TYPE public.payment_status AS ENUM ('paid','pending','overdue');
CREATE TYPE public.ledger_entry_type AS ENUM ('order','payment','adjustment');
CREATE TYPE public.ledger_direction AS ENUM ('debit','credit');
CREATE TYPE public.ledger_status AS ENUM ('completed','pending','overdue');

CREATE TABLE public.user_profiles (id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, email TEXT UNIQUE NOT NULL, full_name TEXT, role public.user_role DEFAULT 'retailer', phone TEXT, business_name TEXT, governorate TEXT, district TEXT, avatar_url TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE public.suppliers (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, region TEXT, rating NUMERIC(3,1) DEFAULT 4.5, phone TEXT, email TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE public.stores (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, owner TEXT, phone TEXT, city TEXT, status public.store_status DEFAULT 'pending', user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE public.products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), barcode TEXT, name TEXT NOT NULL, category TEXT, cost_price BIGINT DEFAULT 0, final_price BIGINT DEFAULT 0, stock INTEGER DEFAULT 0, min_order_qty INTEGER DEFAULT 1, status public.product_status DEFAULT 'متوفر', unit TEXT DEFAULT 'قطعة', supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE public.orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_number TEXT UNIQUE NOT NULL, status public.order_status DEFAULT 'reviewing', payment_status public.payment_status DEFAULT 'pending', buyer_name TEXT, delivery_address TEXT, total BIGINT DEFAULT 0, commission BIGINT DEFAULT 0, store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL, retailer_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL, supplier_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL, delivery_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE public.order_items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE, product_id UUID REFERENCES public.products(id) ON DELETE SET NULL, name TEXT NOT NULL, qty INTEGER DEFAULT 1, unit_price BIGINT DEFAULT 0);
