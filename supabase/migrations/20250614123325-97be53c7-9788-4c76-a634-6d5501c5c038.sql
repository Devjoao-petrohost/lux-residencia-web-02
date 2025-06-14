
-- Step 1: Clean all existing data to ensure a fresh start.
-- This will reset rooms, reservations, and user profiles.
-- WARNING: This is a destructive action and will delete all data in these tables.
DELETE FROM public.hotel_quartos;
DELETE FROM public.hotel_reservas;
DELETE FROM public.profiles;

-- Step 2: Enable Row Level Security (RLS) on tables to protect data.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_quartos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_reservas ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies for the 'profiles' table.
-- First, drop existing policies if they exist to avoid errors.
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Total admins can manage all profiles" ON public.profiles;

-- Users can see their own profile.
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile.
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 'admin_total' can manage any profile.
CREATE POLICY "Total admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin_total');

-- Step 4: Create RLS policies for the 'hotel_quartos' table.
DROP POLICY IF EXISTS "Quartos are publically viewable" ON public.hotel_quartos;
DROP POLICY IF EXISTS "Admins can manage hotel quartos" ON public.hotel_quartos;

-- Anyone can view the rooms.
CREATE POLICY "Quartos are publically viewable"
  ON public.hotel_quartos FOR SELECT
  USING (true);

-- 'admin_hotel' and 'admin_total' can create, update, and delete rooms.
CREATE POLICY "Admins can manage hotel quartos"
  ON public.hotel_quartos FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin_hotel', 'admin_total'));

-- Step 5: Create RLS policies for the 'hotel_reservas' table.
DROP POLICY IF EXISTS "Admins can manage hotel reservations" ON public.hotel_reservas;

-- Only 'admin_hotel' and 'admin_total' can manage reservations.
CREATE POLICY "Admins can manage hotel reservations"
  ON public.hotel_reservas FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin_hotel', 'admin_total'));
