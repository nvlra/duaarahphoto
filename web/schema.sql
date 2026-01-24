CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS public.order_allocations CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.gallery_items CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.expense_categories CASCADE;
DROP TABLE IF EXISTS public.gallery_categories CASCADE;
DROP TABLE IF EXISTS public.invoice_settings CASCADE;
DROP TABLE IF EXISTS public.package_categories CASCADE;
DROP TABLE IF EXISTS public.page_sections CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;

DROP TYPE IF EXISTS public.invoice_status CASCADE;
DROP TYPE IF EXISTS public.order_status CASCADE;
DROP TYPE IF EXISTS public.member_status CASCADE;
DROP TYPE IF EXISTS public.gallery_item_type CASCADE;

CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE public.order_status AS ENUM ('pending', 'booked', 'confirmed', 'on_process', 'completed', 'cancelled');
CREATE TYPE public.member_status AS ENUM ('active', 'inactive');
CREATE TYPE public.gallery_item_type AS ENUM ('image', 'video');

CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT clients_pkey PRIMARY KEY (id)
);

CREATE TABLE public.expense_categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  CONSTRAINT expense_categories_pkey PRIMARY KEY (id)
);

CREATE TABLE public.package_categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT package_categories_pkey PRIMARY KEY (id)
);

CREATE TABLE public.packages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  category_id uuid,
  name text NOT NULL,
  price numeric DEFAULT 0,
  description text,
  features jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT packages_pkey PRIMARY KEY (id),
  CONSTRAINT packages_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.package_categories(id)
);

CREATE TABLE public.orders (
  id text NOT NULL,
  client_id uuid,
  client_name text NOT NULL,
  contact_info text,
  event_date date NOT NULL,
  location text,
  maps_url text,
  package_id uuid,
  package_name text,
  status public.order_status DEFAULT 'pending'::public.order_status,
  total_amount numeric DEFAULT 0,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  payment_status text DEFAULT 'unpaid'::text,
  paid_amount numeric DEFAULT 0,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
  CONSTRAINT orders_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id)
);

CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  description text NOT NULL,
  amount numeric NOT NULL,
  category_id uuid,
  date date DEFAULT CURRENT_DATE,
  type text DEFAULT 'expense'::text,
  related_order_id text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expenses_pkey PRIMARY KEY (id),
  CONSTRAINT expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.expense_categories(id),
  CONSTRAINT expenses_related_order_id_fkey FOREIGN KEY (related_order_id) REFERENCES public.orders(id)
);

CREATE TABLE public.gallery_categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gallery_categories_pkey PRIMARY KEY (id)
);

CREATE TABLE public.gallery_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  type public.gallery_item_type NOT NULL,
  url text NOT NULL,
  category_id uuid,
  section text DEFAULT 'category'::text,
  display_date date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gallery_items_pkey PRIMARY KEY (id),
  CONSTRAINT gallery_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.gallery_categories(id)
);

CREATE TABLE public.invoice_settings (
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  brand_name text,
  brand_color text,
  bank_name text,
  bank_number text,
  bank_holder text,
  address text,
  footer_note text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  brand_logo_url text,
  header_layout text DEFAULT 'vertical'::text,
  brand_font_family text DEFAULT 'Inter'::text,
  brand_custom_font_url text,
  CONSTRAINT invoice_settings_pkey PRIMARY KEY (user_id)
);

CREATE TABLE public.invoices (
  id text NOT NULL,
  order_id text,
  client_name text NOT NULL,
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  amount numeric NOT NULL,
  status public.invoice_status DEFAULT 'draft'::public.invoice_status,
  items jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT invoices_pkey PRIMARY KEY (id),
  CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);

CREATE TABLE public.team_members (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  role text NOT NULL,
  email text,
  phone text,
  status public.member_status DEFAULT 'active'::public.member_status,
  joined_date date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT team_members_pkey PRIMARY KEY (id)
);

CREATE TABLE public.order_allocations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id text,
  member_id uuid,
  role text,
  fee numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_allocations_pkey PRIMARY KEY (id),
  CONSTRAINT order_allocations_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_allocations_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.team_members(id)
);

CREATE TABLE public.page_sections (
  key text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT page_sections_pkey PRIMARY KEY (key)
);

CREATE TABLE public.projects (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text,
  date text,
  location text,
  description text,
  cover_image text,
  gallery_images text[] DEFAULT '{}'::text[],
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);

CREATE TABLE public.site_settings (
  id integer NOT NULL DEFAULT 1 CHECK (id = 1),
  about_headline text,
  about_bio text,
  about_vision text,
  contact_email text,
  contact_phone text,
  contact_address text,
  social_instagram text,
  seo_title text,
  seo_description text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);

-- ================================================
-- 3. RLS (Row Level Security)
-- ================================================
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Default Policies (Authenticated users usually have full access in this simplified schema, adjust as needed)
-- For public facing tables, allow SELECT to anon
CREATE POLICY "Public read access" ON public.packages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access" ON public.package_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access" ON public.gallery_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access" ON public.gallery_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access" ON public.page_sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access" ON public.projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access" ON public.invoice_settings FOR SELECT TO anon, authenticated USING (true);

-- Admin write access (simplified: authenticated users can write everything)
CREATE POLICY "Admin full access" ON public.clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.expense_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.expenses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.gallery_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.gallery_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.invoice_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.order_allocations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.package_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.packages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.page_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ================================================
-- 4. SEED DATA (Optional)
-- ================================================
INSERT INTO public.expense_categories (name) VALUES
('Operasional'), ('Transportasi'), ('Konsumsi'), ('Gaji Tim'), ('Peralatan')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;