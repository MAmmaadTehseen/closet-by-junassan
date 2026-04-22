-- ============================================================
-- Migration 0017: Product Q&A + UGC photos on reviews
-- ============================================================

-- Q&A: public asks, admin answers.
CREATE TABLE IF NOT EXISTS product_questions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  asker_name   text,
  phone        text,
  body         text NOT NULL,
  answer       text,
  answered_at  timestamptz,
  approved     boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_questions_product_approved_idx
  ON product_questions (product_id, approved, created_at DESC);

ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'product_questions'
      AND policyname = 'product_questions_public_read'
  ) THEN
    CREATE POLICY "product_questions_public_read"
      ON product_questions FOR SELECT
      USING (approved = true AND answer IS NOT NULL);
  END IF;
END $$;

-- UGC: a photo URL on a review.
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS photo_url text;
