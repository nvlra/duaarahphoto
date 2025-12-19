-- ================================================
-- DUMMY DATA - Orders Only
-- Expense categories sudah ada, skip saja
-- ================================================

-- 1. Insert Orders (Pesanan)
INSERT INTO public.orders (id, client_name, contact_info, event_date, location, maps_url, package_name, status, payment_status, total_amount, paid_amount) VALUES
('INV-2025-001', 'Sarah & John Wedding', '081234567890', '2025-12-28', 'Hotel Mandarin Oriental, Jakarta', 'https://maps.google.com/?q=mandarin+oriental+jakarta', 'Wedding Gold', 'confirmed', 'paid', 15000000, 15000000),
('INV-2025-002', 'Pernikahan Agung & Kidul', '082345678901', '2026-01-05', 'Gedung Sate, Bandung', 'https://maps.google.com/?q=gedung+sate+bandung', 'Wedding Platinum', 'pending', 'partial', 50000000, 25000000),
('INV-2025-003', 'Portrait Session - Andi', '083456789012', '2025-12-22', 'Studio Enviel', NULL, 'Portrait Basic', 'confirmed', 'paid', 500000, 500000),
('INV-2025-004', 'Prewedding Budi & Citra', '084567890123', '2025-12-30', 'Pantai Ancol', 'https://maps.google.com/?q=ancol+jakarta', 'Prewedding', 'confirmed', 'partial', 3500000, 2000000),
('INV-2025-005', 'Corporate Event PT Maju', '085678901234', '2026-01-15', 'Ritz Carlton Jakarta', 'https://maps.google.com/?q=ritz+carlton+jakarta', 'Corporate Event', 'pending', 'unpaid', 25000000, 0),
('INV-2025-006', 'Graduation Photo - Diana', '086789012345', '2025-12-20', 'Universitas Indonesia', NULL, 'Graduation', 'completed', 'paid', 750000, 750000),
('INV-2025-007', 'Engagement Eko & Fitri', '087890123456', '2025-12-25', 'Cafe Botanica', NULL, 'Engagement', 'confirmed', 'paid', 2500000, 2500000),
('INV-2025-008', 'Family Portrait - Gunawan', '088901234567', '2026-01-10', 'Studio Enviel', NULL, 'Family Portrait', 'pending', 'unpaid', 1500000, 0),
('INV-2025-009', 'New Year Eve Party', '089012345678', '2025-12-31', 'Rooftop Bar Sky Lounge', 'https://maps.google.com/?q=sky+lounge+jakarta', 'Event Coverage', 'confirmed', 'partial', 10000000, 5000000),
('INV-2025-010', 'Birthday Party - Hana', '081112223334', '2026-01-20', 'Rumah Hana, Kemang', NULL, 'Birthday', 'pending', 'unpaid', 2000000, 0)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Team Members (skip jika sudah ada)
INSERT INTO public.team_members (id, name, role, email, phone, status) VALUES
('a1111111-1111-1111-1111-111111111111', 'Ahmad Rizky', 'Lead Photographer', 'ahmad@enviel.com', '081111111111', 'active'),
('b2222222-2222-2222-2222-222222222222', 'Budi Santoso', 'Videographer', 'budi@enviel.com', '082222222222', 'active'),
('c3333333-3333-3333-3333-333333333333', 'Citra Dewi', 'Photo Editor', 'citra@enviel.com', '083333333333', 'active'),
('d4444444-4444-4444-4444-444444444444', 'Doni Pratama', 'Drone Pilot', 'doni@enviel.com', '084444444444', 'active'),
('e5555555-5555-5555-5555-555555555555', 'Eka Saputra', 'Assistant', 'eka@enviel.com', '085555555555', 'inactive')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Clients
INSERT INTO public.clients (name) VALUES
('Sarah & John'),
('Agung Prasetyo'),
('Andi Wijaya'),
('Budi Hartono'),
('PT Maju Bersama'),
('Diana Putri'),
('Eko Prasetya'),
('Keluarga Gunawan'),
('Event Organizer XYZ'),
('Hana Maharani');
