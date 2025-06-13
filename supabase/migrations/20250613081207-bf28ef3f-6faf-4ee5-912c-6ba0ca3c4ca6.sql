
-- First, let's see what the current check constraint allows
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND contype = 'c';

-- Drop the existing role check constraint if it exists
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Create a new check constraint that includes our admin roles
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin_restaurante', 'admin_hotel', 'admin_total'));

-- Now insert the admin users
INSERT INTO profiles (id, role, nome, email)
VALUES 
  ('381d5441-888b-4011-a9ce-ae07ddd4f7ec', 'admin_hotel', 'Administrador do Hotel', 'hotel@masperesidencial.com'),
  ('afb957aa-07ff-487c-8253-3d351018640f', 'admin_total', 'Administrador Total', 'administrador@masperesidencial.com')
ON CONFLICT (id) DO UPDATE
SET 
  role = EXCLUDED.role, 
  nome = EXCLUDED.nome,
  email = EXCLUDED.email;

-- Create the missing tables
CREATE TABLE IF NOT EXISTS admin_access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_name TEXT UNIQUE,
  setting_value JSONB,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on tables
ALTER TABLE hotel_quartos ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Remove existing policies to avoid conflicts
DROP POLICY IF EXISTS "hotel_admin_quartos" ON hotel_quartos;
DROP POLICY IF EXISTS "super_admin_quartos" ON hotel_quartos;
DROP POLICY IF EXISTS "hotel_admin_reservas" ON hotel_reservas;
DROP POLICY IF EXISTS "super_admin_reservas" ON hotel_reservas;
DROP POLICY IF EXISTS "admin_profiles_access" ON profiles;
DROP POLICY IF EXISTS "admin_logs_access" ON admin_access_logs;
DROP POLICY IF EXISTS "admin_settings_access" ON admin_settings;

-- Create the user role checking function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create RLS policies using the security definer function
CREATE POLICY "hotel_admin_quartos" ON hotel_quartos
FOR ALL 
TO authenticated
USING (public.get_current_user_role() IN ('admin_hotel', 'admin_total'));

CREATE POLICY "hotel_admin_reservas" ON hotel_reservas
FOR ALL 
TO authenticated
USING (public.get_current_user_role() IN ('admin_hotel', 'admin_total'));

CREATE POLICY "admin_profiles_access" ON profiles
FOR ALL 
TO authenticated
USING (
  id = auth.uid() OR
  public.get_current_user_role() = 'admin_total'
);

CREATE POLICY "admin_logs_access" ON admin_access_logs
FOR ALL 
TO authenticated
USING (public.get_current_user_role() IN ('admin_hotel', 'admin_total'));

CREATE POLICY "admin_settings_access" ON admin_settings
FOR ALL 
TO authenticated
USING (public.get_current_user_role() = 'admin_total');

-- Insert default settings
INSERT INTO admin_settings (setting_name, setting_value) 
VALUES 
  ('hotel_name', '"Maspe Residencial"'),
  ('max_rooms', '50'),
  ('default_check_in', '"14:00"'),
  ('default_check_out', '"12:00"')
ON CONFLICT (setting_name) DO NOTHING;
