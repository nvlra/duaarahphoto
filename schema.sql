-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ENUMS
create type order_status as enum ('pending', 'confirmed', 'on_process', 'completed', 'cancelled');
create type invoice_status as enum ('paid', 'pending', 'overdue', 'draft');
create type member_status as enum ('active', 'inactive');
create type media_type as enum ('image', 'video');

-- 1. SITE SETTINGS (Generic content management)
create table site_settings (
  id int primary key default 1,
  about_headline text,
  about_bio text,
  about_vision text,
  contact_email text,
  contact_phone text,
  contact_address text,
  social_instagram text,
  seo_title text,
  seo_description text,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

-- 2. TEAM MEMBERS
create table team_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  email text,
  phone text,
  status member_status default 'active',
  joined_date date default current_date,
  created_at timestamptz default now()
);

-- 3. CLIENTS (Optional CRM-lite)
create table clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz default now()
);

-- 4. PACKAGE CATEGORIES
create table package_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- 5. PACKAGES
create table packages (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references package_categories(id) on delete set null,
  name text not null,
  price numeric(15, 2) default 0,
  description text,
  features jsonb, -- Array of strings for features list
  created_at timestamptz default now()
);

-- 6. ORDERS / BOOKINGS
create table orders (
  id text primary key, -- Display ID like 'ORD-2025-001'
  client_id uuid references clients(id) on delete set null,
  client_name text not null, -- Fallback/Cache
  contact_info text,
  event_date date not null,
  location text,
  maps_url text,
  package_id uuid references packages(id) on delete set null,
  package_name text, -- Cache
  status order_status default 'pending',
  payment_status text default 'unpaid', -- 'paid' or 'unpaid'
  total_amount numeric(15, 2) default 0,
  paid_amount numeric(15, 2) default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. ORDER ALLOCATIONS (Team Assigned to Order)
create table order_allocations (
  id uuid primary key default uuid_generate_v4(),
  order_id text references orders(id) on delete cascade,
  member_id uuid references team_members(id) on delete cascade,
  role text, -- Role specific to this event (e.g. "Main Shooters")
  fee numeric(15, 2) default 0,
  created_at timestamptz default now()
);

-- 8. EXPENSE CATEGORIES
create table expense_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique
);

-- 9. EXPENSES / FINANCE
create table expenses (
  id uuid primary key default uuid_generate_v4(),
  description text not null,
  amount numeric(15, 2) not null,
  category_id uuid references expense_categories(id) on delete set null,
  date date default current_date,
  type text default 'expense', -- 'expense', 'team_fee', etc.
  related_order_id text references orders(id) on delete set null,
  created_at timestamptz default now()
);

-- 10. GALLERY CATEGORIES
create table gallery_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamptz default now()
);

-- 11. GALLERY ITEMS
create table gallery_items (
  id uuid primary key default uuid_generate_v4(),
  type media_type not null,
  url text not null,
  category_id uuid references gallery_categories(id) on delete set null,
  section text default 'category', -- 'landing', 'category'
  display_date date default current_date,
  created_at timestamptz default now()
);

-- 12. INVOICES
create table invoices (
  id text primary key, -- 'INV-001'
  order_id text references orders(id) on delete set null,
  client_name text not null,
  issue_date date default current_date,
  due_date date,
  amount numeric(15, 2) not null,
  status invoice_status default 'draft',
  items jsonb, -- Array of invoice items { desc, qty, price }
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on all tables
alter table site_settings enable row level security;
alter table team_members enable row level security;
alter table clients enable row level security;
alter table package_categories enable row level security;
alter table packages enable row level security;
alter table orders enable row level security;
alter table order_allocations enable row level security;
alter table expense_categories enable row level security;
alter table expenses enable row level security;
alter table gallery_categories enable row level security;
alter table gallery_items enable row level security;
alter table invoices enable row level security;

-- Create generic policy for authenticated users (assuming all admins can read/write)
-- For public/client access, you might need different policies.
create policy "Enable all access for authenticated users" on site_settings for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on team_members for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on clients for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on package_categories for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on packages for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on orders for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on order_allocations for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on expense_categories for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on expenses for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on gallery_categories for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on gallery_items for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on invoices for all using (auth.role() = 'authenticated');

-- Public read access for specific tables (Gallery, Packages, Content)
create policy "Enable read access for public" on site_settings for select using (true);
create policy "Enable read access for public" on gallery_items for select using (true);
create policy "Enable read access for public" on gallery_categories for select using (true);
create policy "Enable read access for public" on packages for select using (true);
create policy "Enable read access for public" on package_categories for select using (true);

-- Insert Minimal Initial Data
insert into site_settings (id, about_headline) values (1, 'Welcome to Enviel Admin');

-- NOTE: Admin authentication is now handled by Supabase Auth (Authentication > Users in Dashboard)
-- The previously defined `admin_users` table is no longer needed and has been removed.

-- 13. INVOICE SETTINGS
create table invoice_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique,
  brand_name text,
  brand_logo_url text,
  brand_color text default '#1e293b',
  bank_name text,
  bank_number text,
  bank_holder text,
  address text,
  footer_note text,
  created_at timestamptz default now()
);

alter table invoice_settings enable row level security;

create policy "Users can view their own invoice settings"
  on invoice_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own invoice settings"
  on invoice_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own invoice settings"
  on invoice_settings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own invoice settings"
  on invoice_settings for delete
  using (auth.uid() = user_id);

-- 14. STORAGE & BUCKETS
-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload files to their own folder in 'branding' bucket
CREATE POLICY "Allow authenticated uploads to branding bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'branding' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow authenticated users to update their own files
CREATE POLICY "Allow authenticated updates to branding bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'branding' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'branding' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow public read access to branding bucket
CREATE POLICY "Allow public read access to branding bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'branding');

-- Policy to allow authenticated users to delete their own files
-- Policy to allow authenticated users to delete their own files
-- (Updated for robustness)
CREATE POLICY "Allow authenticated delete in branding bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'branding' AND (
    (storage.foldername(name))[1] = auth.uid()::text 
    OR 
    name LIKE (auth.uid() || '/%')
  )
);

-- MIGRATION: Add Header Layout
-- Add header_layout column to invoice_settings
-- Values: 'vertical' (default, logo top), 'horizontal' (logo left)

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoice_settings' AND column_name = 'header_layout') THEN
        ALTER TABLE invoice_settings ADD COLUMN header_layout text DEFAULT 'vertical';
    END IF;
END $$;

-- MIGRATION: Add Font Settings
-- Add font columns to invoice_settings

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoice_settings' AND column_name = 'brand_font_family') THEN
        ALTER TABLE invoice_settings ADD COLUMN brand_font_family text DEFAULT 'Inter'; -- 'Inter', 'Serif', 'Mono', 'Custom'
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoice_settings' AND column_name = 'brand_custom_font_url') THEN
        ALTER TABLE invoice_settings ADD COLUMN brand_custom_font_url text;
    END IF;
END $$;
