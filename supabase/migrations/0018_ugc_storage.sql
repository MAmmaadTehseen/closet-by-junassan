-- ============================================================
-- Migration 0018: review-photos storage bucket
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'review_photos_public_read'
  ) THEN
    CREATE POLICY "review_photos_public_read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'review-photos');
  END IF;
END $$;
