CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'blog-feature'
);

CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-feature'
);

CREATE POLICY "Allow authenticated users to update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-feature'
)
WITH CHECK (
  bucket_id = 'blog-feature'
);

CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-feature'
);