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
  name text not null,
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
  status text not null default 'pending', -- 'pending', 'completed', 'cancelled', 'archived'
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


-- =============================================
-- SEED DATA (INITIAL DEPLOYMENT)
-- =============================================

-- 1. Insert Team Members
INSERT INTO public.team_members (id, name, role, email, status) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ahmad Rizky', 'Photographer', 'ahmad@example.com', 'active'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Budi Santoso', 'Videographer', 'budi@example.com', 'active'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Citra Dewi', 'Editor', 'citra@example.com', 'active'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Doni Pratama', 'Drone Pilot', 'doni@example.com', 'active'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Eka Saputra', 'Assistant', 'eka@example.com', 'inactive')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Orders
INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-1201', 'Sarah & John Wedding', '2025-12-05', 'Hotel Mandarin Oriental, Jakarta', 'Wedding Gold', 'confirmed', 'paid', 15000000, 15000000) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-1202', 'Pernikahan Agung: Raden Mas Haryo & Roro Kidul Sekartaji', '2025-12-08', 'Gedung Sate Hall A, Lantai 3, Jalan Diponegoro No. 22, Bandung, Jawa Barat', 'Royal Wedding Platinum Ex', 'pending', 'partial', 50000000, 10000000) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-1215A', 'Sesi Foto 1: Andi', '2025-12-15', 'Studio 1', 'Portrait', 'confirmed', 'paid', 500000, 500000) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-1215B', 'Sesi Foto 2: Budi', '2025-12-15', 'Studio 2', 'Portrait', 'confirmed', 'paid', 500000, 500000) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-1215C', 'Sesi Foto 3: Caca', '2025-12-15', 'Studio 1', 'Portrait', 'pending', 'unpaid', 500000, 0) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-1215D', 'Sesi Foto 4: Dedi', '2025-12-15', 'Studio 2', 'Portrait', 'completed', 'paid', 500000, 500000) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-1215E', 'Sesi Foto 5: Euis', '2025-12-15', 'Outdoor Garden', 'Graduation', 'cancelled', 'unpaid', 750000, 0) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-1220', 'Secret Proposal', '2025-12-20', NULL, 'Engagement', 'confirmed', 'paid', 3000000, 3000000) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-1222', 'PT Teknologi Maju Gathering', '2025-12-22', 'Ritz Carlton', 'Corp Event', 'completed', 'paid', 25000000, 25000000) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-1224', 'Batal: Prewed Rina', '2025-12-24', 'Pantai Indah Kapuk', 'Prewedding', 'cancelled', 'unpaid', 2500000, 0) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-1231', 'New Year Eve Party', '2025-12-31', 'Rooftop Cafe', 'Event Coverage', 'confirmed', 'partial', 10000000, 5000000) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-1130', 'Late Nov Wedding', '2025-11-30', 'Bandung', 'Wedding', 'completed', 'paid', 12000000, 12000000) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (id, client_name, event_date, location, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2026-0101', 'Early Jan Wedding', '2026-01-01', 'Jakarta', 'Wedding', 'confirmed', 'unpaid', 15000000, 0) ON CONFLICT (id) DO NOTHING;

-- 3. Insert Allocations
INSERT INTO public.order_allocations (order_id, member_id, role, fee) VALUES ('INV-2025-1201', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Main Photo', 2000000);
INSERT INTO public.order_allocations (order_id, member_id, role, fee) VALUES ('INV-2025-1201', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Video', 1500000);
INSERT INTO public.order_allocations (order_id, member_id, role, fee) VALUES ('INV-2025-1202', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Lead', 3000000);
INSERT INTO public.order_allocations (order_id, member_id, role, fee) VALUES ('INV-2025-1202', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Editor', 1000000);
INSERT INTO public.order_allocations (order_id, member_id, role, fee) VALUES ('INV-2025-1202', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Drone', 1500000);
INSERT INTO public.order_allocations (order_id, member_id, role, fee) VALUES ('INV-2025-1215A', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Photo', 200000);

-- 4. Expense Categories
INSERT INTO public.expense_categories (id, name) VALUES
('6ea8d6c7-3932-4828-98e6-123456789001', 'Operasional'),
('6ea8d6c7-3932-4828-98e6-123456789002', 'Transportasi'),
('6ea8d6c7-3932-4828-98e6-123456789003', 'Konsumsi'),
('6ea8d6c7-3932-4828-98e6-123456789004', 'Gaji Tim / Talent')
ON CONFLICT (id) DO NOTHING;

-- 5. Expenses (Dec 2025)
INSERT INTO public.expenses (description, amount, date, category_id) VALUES
('Bensin & Tol Wedding Sarah', 250000, '2025-12-05', '6ea8d6c7-3932-4828-98e6-123456789002'),
('Makan Siang Kru Wedding Sarah', 300000, '2025-12-05', '6ea8d6c7-3932-4828-98e6-123456789003'),
('Sewa Lensa Tambahan', 500000, '2025-12-07', '6ea8d6c7-3932-4828-98e6-123456789001'),
('Gaji Asisten Freelance (Eka)', 750000, '2025-12-08', '6ea8d6c7-3932-4828-98e6-123456789004'),
('Service Kamera Tahunan', 1500000, '2025-12-10', '6ea8d6c7-3932-4828-98e6-123456789001'),
('Transport ke Bandung (Prewed)', 450000, '2025-12-08', '6ea8d6c7-3932-4828-98e6-123456789002'),
('Cetak Foto Frame 20R', 350000, '2025-12-29', '6ea8d6c7-3932-4828-98e6-123456789001');

-- 6. Insert Clients (Fixed: Added name column)
INSERT INTO public.clients (id, name, created_at) VALUES 
(gen_random_uuid(), 'Sarah & John', '2025-12-01 10:00:00'),
(gen_random_uuid(), 'Andi Saputra', '2025-12-05 14:00:00'),
(gen_random_uuid(), 'Budi Hartono', '2025-12-10 09:00:00'),
(gen_random_uuid(), 'Caca Marica', '2025-12-15 16:00:00'),
(gen_random_uuid(), 'Dedi Corbuz', '2025-12-20 11:00:00');
