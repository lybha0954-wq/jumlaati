-- ============================================================
-- Jumlaati Platform — Auth Trigger & Seed Demo Accounts
-- ============================================================

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Trigger function: Auto-create or update user_profiles on auth.users INSERT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role, is_active)
        VALUES (
                    NEW.id,
                            NEW.email,
                                    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
                                            COALESCE(NEW.raw_user_meta_data->>'role', 'retailer')::public.user_role,
                                                    true
        )
            ON CONFLICT (id) DO UPDATE
                    SET email = EXCLUDED.email,
                                full_name = COALESCE(EXCLUDED.full_name, public.user_profiles.full_name),
                                            role = COALESCE(EXCLUDED.role, public.user_profiles.role),
                                                        updated_at = CURRENT_TIMESTAMP;
                                                            RETURN NEW;
                                                            END;
                                                            $$;

                                                            -- 2. Bind Trigger on auth.users
                                                            DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
                                                            CREATE TRIGGER on_auth_user_created
                                                                AFTER INSERT ON auth.users
                                                                    FOR EACH ROW
                                                                        EXECUTE FUNCTION public.handle_new_user();

                                                                        -- 3. RLS policies for user_profiles
                                                                        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

                                                                        DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
                                                                        CREATE POLICY "users_manage_own_user_profiles"
                                                                        ON public.user_profiles
                                                                        FOR ALL
                                                                        TO authenticated
                                                                        USING (id = auth.uid())
                                                                        WITH CHECK (id = auth.uid());

                                                                        DROP POLICY IF EXISTS "admin_read_all_user_profiles" ON public.user_profiles;
                                                                        CREATE POLICY "admin_read_all_user_profiles"
                                                                        ON public.user_profiles
                                                                        FOR SELECT
                                                                        TO authenticated
                                                                        USING (public.is_admin_from_auth());

                                                                        -- 4. Seed Demo Users (Retailer, Supplier, Admin)
                                                                        DO $$
                                                                        DECLARE
                                                                            retailer_uuid UUID := gen_random_uuid();
                                                                                supplier_uuid UUID := gen_random_uuid();
                                                                                    admin_uuid    UUID := gen_random_uuid();
                                                                                    BEGIN
                                                                                        -- Retailer demo account
                                                                                            INSERT INTO auth.users (
                                                                                                        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
                                                                                                                created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
                                                                                                                        is_sso_user, is_anonymous
                                                                                            ) VALUES (
                                                                                                        retailer_uuid,
                                                                                                                '00000000-0000-0000-0000-000000000000',
                                                                                                                        'authenticated', 'authenticated',
                                                                                                                                'hassan.albaqali@jumlaati.iq',
                                                                                                                                        crypt('Retailer@2026', gen_salt('bf', 10)),
                                                                                                                                                now(), now(), now(),
                                                                                                                                                        jsonb_build_object('full_name', 'حسن البقالي', 'role', 'retailer'),
                                                                                                                                                                jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
                                                                                                                                                                        false, false
                                                                                            ) ON CONFLICT (email) DO NOTHING;

                                                                                                -- Supplier demo account
                                                                                                    INSERT INTO auth.users (
                                                                                                                id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
                                                                                                                        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
                                                                                                                                is_sso_user, is_anonymous
                                                                                                    ) VALUES (
                                                                                                                supplier_uuid,
                                                                                                                        '00000000-0000-0000-0000-000000000000',
                                                                                                                                'authenticated', 'authenticated',
                                                                                                                                        'ahmed.aljabouri@jumlaati.iq',
                                                                                                                                                crypt('Supplier@2026', gen_salt('bf', 10)),
                                                                                                                                                        now(), now(), now(),
                                                                                                                                                                jsonb_build_object('full_name', 'أحمد الجبوري', 'role', 'supplier'),
                                                                                                                                                                        jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
                                                                                                                                                                                false, false
                                                                                                    ) ON CONFLICT (email) DO NOTHING;

                                                                                                        -- Admin demo account
                                                                                                            INSERT INTO auth.users (
                                                                                                                        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
                                                                                                                                created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
                                                                                                                                        is_sso_user, is_anonymous
                                                                                                            ) VALUES (
                                                                                                                        admin_uuid,
                                                                                                                                '00000000-0000-0000-0000-000000000000',
                                                                                                                                        'authenticated', 'authenticated',
                                                                                                                                                'admin@jumlaati.iq',
                                                                                                                                                        crypt('Admin@2026!', gen_salt('bf', 10)),
                                                                                                                                                                now(), now(), now(),
                                                                                                                                                                        jsonb_build_object('full_name', 'مدير النظام', 'role', 'admin'),
                                                                                                                                                                                jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
                                                                                                                                                                                        false, false
                                                                                                            ) ON CONFLICT (email) DO NOTHING;

                                                                                                                -- Link supplier_uuid to existing demo supplier record if exists
                                                                                                                    UPDATE public.suppliers 
                                                                                                                        SET user_id = (SELECT id FROM auth.users WHERE email = 'ahmed.aljabouri@jumlaati.iq')
                                                                                                                            WHERE email = 'aljabouri@example.com' OR email = 'ahmed.aljabouri@jumlaati.iq';

                                                                                                                                -- Link retailer_uuid to existing demo store record if exists
                                                                                                                                    UPDATE public.stores 
                                                                                                                                        SET user_id = (SELECT id FROM auth.users WHERE email = 'hassan.albaqali@jumlaati.iq')
                                                                                                                                            WHERE owner = 'أحمد العبيدي' OR owner = 'حسن البقالي';

                                                                                                                                            EXCEPTION
                                                                                                                                                WHEN OTHERS THEN
                                                                                                                                                        RAISE NOTICE 'Demo user insertion process logged message: %', SQLERRM;
                                                                                                                                                        END $$;
                                                                                                                                                        
                                                                                                            )
                                                                                                            )
                                                                                                    )
                                                                                                    )
                                                                                            )
                                                                                            )
        )