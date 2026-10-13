-- ==============================================================================
-- NEW MADINA ELECTRONICS - SUPABASE DATABASE COMPLETE SETUP SCRIPT
-- Authorized Casio Watch Store · Saddar Karachi
-- Instructions: Supabase Dashboard -> SQL Editor -> New Query -> Paste & Click 'RUN'
-- This script is idempotent: you can safely run it multiple times without any errors.
-- ==============================================================================

-- 1. Create Products Table (Casio Watches Catalog)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    model TEXT NOT NULL,
    name TEXT NOT NULL,
    series TEXT NOT NULL,
    gender TEXT NOT NULL DEFAULT 'Men',
    price_pkr INTEGER NOT NULL,
    original_price_pkr INTEGER,
    stock_count INTEGER DEFAULT 10,
    image_url TEXT NOT NULL,
    alternate_image_url TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_in_stock BOOLEAN DEFAULT TRUE,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 18,
    specs JSONB DEFAULT '{}'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all columns exist in case table was created earlier
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_count INTEGER DEFAULT 10;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price_pkr INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS alternate_image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rating NUMERIC(2, 1) DEFAULT 4.9;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 18;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 2. Create Orders Table (Customer Checkout & Booking Details)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    total_pkr INTEGER NOT NULL,
    items JSONB NOT NULL,
    order_notes TEXT,
    status TEXT NOT NULL DEFAULT 'Pending Verification',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure order columns exist
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_notes TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pending Verification';

-- 3. Create Site Settings Table (Store info, Announcement banner, Timings, Contact)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 5. Safe Policies for Products (Drop old policies first to avoid "already exists" errors)
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert products" ON public.products;
DROP POLICY IF EXISTS "Allow public update products" ON public.products;
DROP POLICY IF EXISTS "Allow public delete products" ON public.products;
DROP POLICY IF EXISTS "Allow public all products" ON public.products;

-- Allow public catalog browsing
CREATE POLICY "Public read products" 
    ON public.products 
    FOR SELECT 
    USING (true);

-- Allow Admin Panel sync / updates
CREATE POLICY "Allow public insert products" 
    ON public.products 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update products" 
    ON public.products 
    FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public delete products" 
    ON public.products 
    FOR DELETE 
    USING (true);

-- 6. Safe Policies for Orders
DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public all orders" ON public.orders;

-- Allow customers to place orders
CREATE POLICY "Allow public insert orders" 
    ON public.orders 
    FOR INSERT 
    WITH CHECK (true);

-- Allow reading orders (Admin dashboard)
CREATE POLICY "Allow public read orders" 
    ON public.orders 
    FOR SELECT 
    USING (true);

-- Allow updating order status (Admin dashboard)
CREATE POLICY "Allow public update orders" 
    ON public.orders 
    FOR UPDATE 
    USING (true);

-- 7. Safe Policies for Site Settings
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow public modify site_settings" ON public.site_settings;

CREATE POLICY "Public read site_settings" 
    ON public.site_settings 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow public modify site_settings" 
    ON public.site_settings 
    FOR ALL 
    USING (true);

-- 8. Seed Initial Store Settings
INSERT INTO public.site_settings (key, value) VALUES
('store_info', '{
    "store_name": "New Madina Electronics",
    "tagline": "Genuine Casio Timepieces · Saddar Karachi",
    "phone": "+92 321 3979883",
    "whatsapp": "923213979883",
    "address": "Shop 141, 1st Floor, Paradise Shopping Centre, Saddar, Karachi",
    "timings": "11:30 AM – 10:00 PM (Mon-Sat)"
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ==============================================================================
-- SETUP COMPLETE! 
-- Now in your app or Netlify settings, set:
-- VITE_SUPABASE_URL = your project URL (e.g. https://xyz.supabase.co)
-- VITE_SUPABASE_ANON_KEY = your anon public key
-- Then in the Admin Panel (PIN: 1410), click "Sync Catalog to Supabase"
-- ==============================================================================
