-- Drop existing policy if it exists to ensure clean slate
DROP POLICY IF EXISTS "Allow authenticated delete in branding bucket" ON storage.objects;

-- Re-create the delete policy with a more permissive path check (standard folder match OR strict prefix match)
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
