-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Site Settings (CMS)
create table public.site_settings (
  id uuid not null default gen_random_uuid (),
  about_headline text null,
  about_bio text null,
  about_vision text null,
  contact_email text null,
  contact_phone text null,
  contact_address text null,
  social_instagram text null,
  created_at timestamp with time zone not null default now(),
  constraint site_settings_pkey primary key (id)
);

-- 2. Invoice Settings
create table public.invoice_settings (
  id uuid not null default gen_random_uuid (),
  brand_name text null,
  brand_color text null,
  brand_logo_url text null,
  bank_name text null,
  bank_number text null,
  bank_holder text null,
  address text null,
  footer_note text null,
  created_at timestamp with time zone not null default now(),
  constraint invoice_settings_pkey primary key (id)
);

-- 3. Team Members
create table public.team_members (
  id uuid not null default gen_random_uuid (),
  name text not null,
  role text not null,
  email text null,
  phone text null,
  status text not null default 'active', -- 'active', 'inactive'
  joined_date date null default CURRENT_DATE,
  created_at timestamp with time zone not null default now(),
  constraint team_members_pkey primary key (id)
);

-- 4. Clients (Used for analytics/history)
create table public.clients (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  constraint clients_pkey primary key (id)
);

-- 5. Package Categories
create table public.package_categories (
  id uuid not null default gen_random_uuid (),
  name text not null,
  description text null,
  created_at timestamp with time zone not null default now(),
  constraint package_categories_pkey primary key (id)
);

-- 6. Packages
create table public.packages (
  id uuid not null default gen_random_uuid (),
  category_id uuid references public.package_categories (id) on delete cascade,
  name text not null,
  price numeric not null default 0,
  description text null,
  features text[] null, -- Array of strings
  created_at timestamp with time zone not null default now(),
  constraint packages_pkey primary key (id)
);

-- 7. Orders
create table public.orders (
  id text not null, -- Manual ID e.g., 'INV-2024-001' or UUID string
  client_name text not null,
  client_email text null,
  client_phone text null, -- mapped to contact_info? No, contact_info usually separate
  contact_info text null,
  event_date date not null,
  event_location text null,
  maps_url text null,
  package_name text null, -- Snapshot of package name
  status text not null default 'pending', -- 'pending', 'completed', 'cancelled'
  payment_status text not null default 'unpaid', -- 'paid', 'unpaid', 'partial'
  total_amount numeric not null default 0,
  paid_amount numeric null default 0,
  created_at timestamp with time zone not null default now(),
  constraint orders_pkey primary key (id)
);

-- 8. Order Allocations (Team assignments)
create table public.order_allocations (
  id uuid not null default gen_random_uuid (),
  order_id text references public.orders (id) on delete cascade,
  member_id uuid references public.team_members (id) on delete set null,
  role text not null,
  fee numeric not null default 0,
  created_at timestamp with time zone not null default now(),
  constraint order_allocations_pkey primary key (id)
);

-- 9. Gallery Categories
create table public.gallery_categories (
  id uuid not null default gen_random_uuid (),
  name text not null,
  created_at timestamp with time zone not null default now(),
  constraint gallery_categories_pkey primary key (id)
);

-- 10. Gallery Items
create table public.gallery_items (
  id uuid not null default gen_random_uuid (),
  category_id uuid references public.gallery_categories (id) on delete cascade,
  url text not null,
  caption text null,
  created_at timestamp with time zone not null default now(),
  constraint gallery_items_pkey primary key (id)
);

-- 11. Expense Categories
create table public.expense_categories (
  id uuid not null default gen_random_uuid (),
  name text not null,
  created_at timestamp with time zone not null default now(),
  constraint expense_categories_pkey primary key (id)
);

-- 12. Expenses
create table public.expenses (
  id uuid not null default gen_random_uuid (),
  category_id uuid references public.expense_categories (id) on delete set null,
  description text not null,
  amount numeric not null default 0,
  date date not null default CURRENT_DATE,
  created_at timestamp with time zone not null default now(),
  constraint expenses_pkey primary key (id)
);

-- STORAGE BUCKETS (Instructions)
-- 1. 'branding' (Public) - For Invoice Logos
-- 2. 'gallery' (Public) - For Portfolio Images (Assumed)

-- RLS (Row Level Security) - OPTIONAL but Recommended
-- alter table public.team_members enable row level security;
-- create policy "Enable read access for all users" on public.team_members for select using (true);
-- (Repeat for other tables if needed)
