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
