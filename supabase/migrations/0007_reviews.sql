-- ============================================================
-- Migration 0007: Customer reviews
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id    uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rating      int  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        text NOT NULL,
  author_name text NOT NULL,
  approved    boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reviews_product_approved_idx
  ON reviews (product_id, approved, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS reviews_unique_per_order_item
  ON reviews (order_id, product_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'reviews' AND policyname = 'reviews_public_read_approved'
  ) THEN
    CREATE POLICY "reviews_public_read_approved"
      ON reviews FOR SELECT
      USING (approved = true);
  END IF;
END $$;
