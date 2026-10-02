-- ============================================================
-- NEW MADINA ELECTRONICS - SUPABASE DATABASE SETUP SCRIPT
-- Paste this script into Supabase SQL Editor and click "RUN"
-- ============================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    model TEXT NOT NULL,
    name TEXT NOT NULL,
    series TEXT NOT NULL,
    gender TEXT NOT NULL DEFAULT 'Men',
    price_pkr INTEGER NOT NULL,
    original_price_pkr INTEGER,
    image_url TEXT NOT NULL,
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

-- 2. Create Orders Table
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
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Site Settings Table (For Store Announcements, Timings, WhatsApp number, etc.)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 5. Products Security Policies
-- Anyone can view products
CREATE POLICY "Public read products" 
    ON public.products 
    FOR SELECT 
    USING (true);

-- Anyone can insert/update/delete products with anon key (or secure with your custom admin PIN in the app)
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

-- 6. Orders Security Policies
-- Anyone can place an order (Insert)
CREATE POLICY "Allow public insert orders" 
    ON public.orders 
    FOR INSERT 
    WITH CHECK (true);

-- Allow reading orders (Admin)
CREATE POLICY "Allow public read orders" 
    ON public.orders 
    FOR SELECT 
    USING (true);

-- Allow updating order status (Admin)
CREATE POLICY "Allow public update orders" 
    ON public.orders 
    FOR UPDATE 
    USING (true);

-- 7. Site Settings Security Policies
CREATE POLICY "Public read site_settings" 
    ON public.site_settings 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow public modify site_settings" 
    ON public.site_settings 
    FOR ALL 
    USING (true);

-- Initial Store Settings Seed
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
