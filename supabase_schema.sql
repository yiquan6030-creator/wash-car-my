-- ========================================================
-- WashCar MY — Supabase Database Migration & Schema SQL
-- Copy and execute this entire SQL script in Supabase SQL Editor
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plate_number VARCHAR(20) NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    color VARCHAR(30),
    tier VARCHAR(20) NOT NULL DEFAULT 'sedan',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SERVICE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.service_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tagline TEXT,
    description TEXT,
    starting_price_myr NUMERIC(10,2) NOT NULL,
    duration_range VARCHAR(50),
    icon VARCHAR(10),
    badge VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SERVICE ADDONS TABLE
CREATE TABLE IF NOT EXISTS public.service_addons (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_myr NUMERIC(10,2) NOT NULL,
    icon VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    label VARCHAR(50) NOT NULL DEFAULT 'Home',
    address_line1 TEXT NOT NULL,
    condo_building_name VARCHAR(100),
    unit_parking_bay VARCHAR(50),
    postcode VARCHAR(10),
    city VARCHAR(50),
    state VARCHAR(50),
    notes_for_washer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. WASHER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.washer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    avatar_url TEXT,
    rating NUMERIC(3,2) DEFAULT 5.00,
    completed_jobs_count INT DEFAULT 0,
    vehicle_rig VARCHAR(100),
    current_zone VARCHAR(100),
    is_online BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id VARCHAR(30) PRIMARY KEY,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_id VARCHAR(50) REFERENCES public.service_categories(id),
    vehicle_plate VARCHAR(20) NOT NULL,
    vehicle_make_model VARCHAR(100) NOT NULL,
    location_address TEXT NOT NULL,
    washer_notes TEXT,
    booking_type VARCHAR(20) DEFAULT 'now',
    scheduled_date VARCHAR(50),
    scheduled_time VARCHAR(50),
    subtotal_myr NUMERIC(10,2) NOT NULL,
    service_fee_myr NUMERIC(10,2) DEFAULT 2.00,
    discount_myr NUMERIC(10,2) DEFAULT 0.00,
    total_myr NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'fpx',
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed',
    washer_id UUID REFERENCES public.washer_profiles(id),
    eta_minutes INT DEFAULT 8,
    user_rating INT,
    driver_tip_myr NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PROMOTIONS TABLE
CREATE TABLE IF NOT EXISTS public.promotions (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    discount_text VARCHAR(50) NOT NULL,
    description TEXT,
    code VARCHAR(30) UNIQUE NOT NULL,
    color_bg VARCHAR(20) DEFAULT '#0284c7',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.washer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to service categories, addons, washer profiles & promotions
CREATE POLICY "Allow public read service_categories" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read service_addons" ON public.service_addons FOR SELECT USING (true);
CREATE POLICY "Allow public read washer_profiles" ON public.washer_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read promotions" ON public.promotions FOR SELECT USING (true);

-- Allow public select/insert on bookings for demo testing
CREATE POLICY "Allow all bookings access" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Allow all vehicles access" ON public.vehicles FOR ALL USING (true);
CREATE POLICY "Allow all locations access" ON public.locations FOR ALL USING (true);

-- ========================================================
-- INITIAL MALAYSIAN SEED DATA
-- ========================================================

INSERT INTO public.service_categories (id, name, tagline, description, starting_price_myr, duration_range, icon, badge)
VALUES 
  ('exterior_wash', 'Exterior Wash', 'Basic exterior hand wash & rim wipe', 'Exterior hand wash & rim cleaning', 28.00, '30–40 min', '🧼', NULL),
  ('interior_exterior', 'Interior + Exterior', 'Most popular full wash & vacuum', 'Full exterior foam wash, cabin vacuum & dashboard wipe', 48.00, '45–60 min', '✨', 'MOST POPULAR'),
  ('low_water_eco', 'Low-Water Eco', 'Designed for condo & basement parking', 'Waterless biodegradable hand spray wash with zero runoff', 35.00, '30–45 min', '💧', 'CONDO FRIENDLY'),
  ('steam_detailing', 'Steam Detailing', 'Deeper thermal steam sanitization', 'Deep cabin steam sanitization & air vent treatment', 88.00, '60–75 min', '💨', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.service_addons (id, name, description, price_myr, icon)
VALUES 
  ('add_tyre_shine', 'Tyre Shine', 'Long-lasting wet look tyre gel dressing', 5.00, '🛞'),
  ('add_fragrance', 'Interior Fragrance', 'Fresh lavender or ocean breeze cabin spray', 5.00, '🌸'),
  ('add_rain_repellent', 'Rain Repellent', 'Hydrophobic windscreen water beading coating', 8.00, '🌧️'),
  ('add_glass_treatment', 'Glass Treatment', 'Anti-fog & crystal glass clarity coat', 10.00, '🛡️')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.promotions (id, title, discount_text, description, code, color_bg)
VALUES 
  ('promo_first', 'First Wash Discount', 'RM5 OFF', 'RM5 discount on your first doorstep mobile wash.', 'FIRSTWASH5', '#0284c7'),
  ('promo_pack', 'Book 3 Washes & Save', '15% OFF', 'Save 15% when you bundle 3 wash credits.', 'SAVE15', '#16a34a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.washer_profiles (name, phone, avatar_url, rating, completed_jobs_count, vehicle_rig, current_zone, is_online)
VALUES 
  ('Amir', '+60 12-345 6789', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 4.90, 342, 'Perodua Axia Mobile Rig #4', 'Bangsar / Mont Kiara, KL', true);
