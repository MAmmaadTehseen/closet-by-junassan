-- ============================================================
-- Migration 0005: Product Images Storage Bucket
-- ============================================================

-- Create the product-images bucket (public so URLs work without auth tokens)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,                             -- public = images are accessible via public URL
  5242880,                          -- 5 MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Public read policy (anyone can view uploaded images)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'product_images_public_read'
  ) THEN
    CREATE POLICY "product_images_public_read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'product-images');
  END IF;
END $$;

-- NOTE: Uploads use the service-role key (server actions only), which bypasses
-- RLS entirely — so no INSERT policy is needed. This keeps the bucket safe:
-- only your server can write to it, but anyone can read from it.
