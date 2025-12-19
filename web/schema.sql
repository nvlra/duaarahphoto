-- ================================================
-- ENVIEL PHOTOGRAPHY - DATABASE SCHEMA
-- Supabase PostgreSQL | Version 3.0
-- Jalankan di SQL Editor untuk fresh install
-- ================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. ORDERS (Pesanan Klien)
-- ================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  contact_info TEXT,
  event_date DATE NOT NULL,
  location TEXT,
  maps_url TEXT,
  package_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================
-- 2. TEAM MEMBERS (Tim)
-- ================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- 3. ORDER ALLOCATIONS (Penugasan Tim)
-- ================================================
CREATE TABLE IF NOT EXISTS public.order_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  role TEXT NOT NULL,
  fee NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- 4. EXPENSE CATEGORIES (Kategori Pengeluaran)
-- ================================================
CREATE TABLE IF NOT EXISTS public.expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- 5. EXPENSES (Pengeluaran)
-- ================================================
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.expense_categories(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- 6. CLIENTS (untuk Analytics)
-- ================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- 7. PACKAGE CATEGORIES
-- ================================================
CREATE TABLE IF NOT EXISTS public.package_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- 8. PACKAGES (Paket Layanan)
-- ================================================
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.package_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  features TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- 9. PAGE SECTIONS (CMS Landing Page)
-- ================================================
CREATE TABLE IF NOT EXISTS public.page_sections (
  id TEXT PRIMARY KEY,
  section_type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================
-- 10. PROJECTS (Portfolio)
-- ================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  cover_image TEXT,
  images TEXT[],
  description TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- 11. GALLERY CATEGORIES
-- ================================================
CREATE TABLE IF NOT EXISTS public.gallery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- 12. GALLERY ITEMS
-- ================================================
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.gallery_categories(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- 13. SITE SETTINGS
-- ================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  about_headline TEXT,
  about_bio TEXT,
  about_vision TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  social_instagram TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- 14. INVOICE SETTINGS
-- ================================================
CREATE TABLE IF NOT EXISTS public.invoice_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT,
  brand_color TEXT,
  brand_logo_url TEXT,
  bank_name TEXT,
  bank_number TEXT,
  bank_holder TEXT,
  address TEXT,
  footer_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS on all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_settings ENABLE ROW LEVEL SECURITY;

-- Force RLS
ALTER TABLE public.orders FORCE ROW LEVEL SECURITY;
ALTER TABLE public.order_allocations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.team_members FORCE ROW LEVEL SECURITY;
ALTER TABLE public.expenses FORCE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.clients FORCE ROW LEVEL SECURITY;
ALTER TABLE public.packages FORCE ROW LEVEL SECURITY;
ALTER TABLE public.package_categories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections FORCE ROW LEVEL SECURITY;
ALTER TABLE public.projects FORCE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items FORCE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings FORCE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_settings FORCE ROW LEVEL SECURITY;

-- ================================================
-- POLICIES - Private Tables (Admin Only)
-- ================================================
CREATE POLICY "orders_policy" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allocations_policy" ON public.order_allocations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "team_policy" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "expenses_policy" ON public.expenses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "expense_cat_policy" ON public.expense_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "clients_policy" ON public.clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "site_settings_policy" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "invoice_settings_policy" ON public.invoice_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "gallery_cat_policy" ON public.gallery_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "gallery_items_policy" ON public.gallery_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ================================================
-- POLICIES - Public Tables (Landing Page)
-- ================================================
-- Packages
CREATE POLICY "packages_read" ON public.packages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "packages_write" ON public.packages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "packages_update" ON public.packages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "packages_delete" ON public.packages FOR DELETE TO authenticated USING (true);

-- Package Categories
CREATE POLICY "pkg_cat_read" ON public.package_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "pkg_cat_write" ON public.package_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "pkg_cat_update" ON public.package_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "pkg_cat_delete" ON public.package_categories FOR DELETE TO authenticated USING (true);

-- Page Sections
CREATE POLICY "sections_read" ON public.page_sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "sections_write" ON public.page_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "sections_update" ON public.page_sections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "sections_delete" ON public.page_sections FOR DELETE TO authenticated USING (true);

-- Projects
CREATE POLICY "projects_read" ON public.projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "projects_write" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "projects_update" ON public.projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "projects_delete" ON public.projects FOR DELETE TO authenticated USING (true);

-- ================================================
-- SEED DATA - Expense Categories
-- ================================================
INSERT INTO public.expense_categories (name) VALUES
('Operasional'),
('Transportasi'),
('Konsumsi'),
('Gaji Tim'),
('Peralatan')
ON CONFLICT (name) DO NOTHING;

-- ================================================
-- DONE! Database siap digunakan
-- ================================================
