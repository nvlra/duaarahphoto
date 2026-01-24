INSERT INTO storage.buckets (id, name, public) 
VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'branding' );

CREATE POLICY "Authenticated users can upload branding"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'branding' );

CREATE POLICY "Authenticated users can update branding"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'branding' );

CREATE POLICY "Authenticated users can delete branding"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'branding' );
