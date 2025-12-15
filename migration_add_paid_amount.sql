-- Run this in your Supabase SQL Editor

-- 1. Add paid_amount column to orders table (defaults to 0)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS paid_amount numeric(15, 2) DEFAULT 0;

-- 2. Optional: Add paid_amount to Invoice table if you plan to sync them, 
-- but for now the Invoice takes data from Order directly.
