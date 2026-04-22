-- ============================================================
-- Migration 0010: "Complete the Look" bundles
-- ============================================================

CREATE TABLE IF NOT EXISTS bundles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  combo_price_pkr int  NOT NULL CHECK (combo_price_pkr > 0),
  active          boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bundle_products (
  bundle_id  uuid NOT NULL REFERENCES bundles(id)   ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id)  ON DELETE CASCADE,
  position   int  NOT NULL DEFAULT 0,
  PRIMARY KEY (bundle_id, product_id)
);

CREATE INDEX IF NOT EXISTS bundle_products_product_idx
  ON bundle_products (product_id);

CREATE INDEX IF NOT EXISTS bundle_products_position_idx
  ON bundle_products (bundle_id, position);

ALTER TABLE bundles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'bundles' AND policyname = 'bundles_public_read'
  ) THEN
    CREATE POLICY "bundles_public_read"
      ON bundles FOR SELECT
      USING (active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'bundle_products' AND policyname = 'bundle_products_public_read'
  ) THEN
    CREATE POLICY "bundle_products_public_read"
      ON bundle_products FOR SELECT
      USING (true);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION set_bundles_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bundles_set_updated_at ON bundles;
CREATE TRIGGER bundles_set_updated_at
  BEFORE UPDATE ON bundles
  FOR EACH ROW EXECUTE FUNCTION set_bundles_updated_at();
