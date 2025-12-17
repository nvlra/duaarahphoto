-- Add header_layout column to invoice_settings
-- Values: 'vertical' (default, logo top), 'horizontal' (logo left)

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoice_settings' AND column_name = 'header_layout') THEN
        ALTER TABLE invoice_settings ADD COLUMN header_layout text DEFAULT 'vertical';
    END IF;
END $$;
