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
CREATE POLICY "Allow authenticated delete in branding bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'branding' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
