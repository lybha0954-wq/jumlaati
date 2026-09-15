-- 006_functions.sql — Security helper functions + trigger
CREATE OR REPLACE FUNCTION public.is_admin_from_auth() RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$ SELECT EXISTS (SELECT 1 FROM auth.users au WHERE au.id = auth.uid() AND (au.raw_user_meta_data->>'role' IN ('admin','owner') OR au.raw_app_meta_data->>'role' IN ('admin','owner'))) $$;
CREATE OR REPLACE FUNCTION public.is_owner_from_auth() RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$ SELECT EXISTS (SELECT 1 FROM auth.users au WHERE au.id = auth.uid() AND (au.raw_user_meta_data->>'role' = 'owner' OR au.raw_app_meta_data->>'role' = 'owner')) $$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
