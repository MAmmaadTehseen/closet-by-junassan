-- ============================================================
-- Migration 0009: Editorial collections (curated product sets)
-- ============================================================

CREATE TABLE IF NOT EXISTS collections (
  slug            text PRIMARY KEY,
  title           text NOT NULL,
  subtitle        text,
  cover_image     text,
  description_md  text,
  featured        boolean NOT NULL DEFAULT false,
  sort_order      int     NOT NULL DEFAULT 0,
  active          boolean NOT NULL DEFAULT true,
  published_at    timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collection_products (
  collection_slug text NOT NULL REFERENCES collections(slug) ON DELETE CASCADE,
  product_id      uuid NOT NULL REFERENCES products(id)       ON DELETE CASCADE,
  position        int  NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_slug, product_id)
);

CREATE INDEX IF NOT EXISTS collection_products_position_idx
  ON collection_products (collection_slug, position);

CREATE INDEX IF NOT EXISTS collections_active_sort_idx
  ON collections (active, sort_order);

ALTER TABLE collections         ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'collections' AND policyname = 'collections_public_read'
  ) THEN
    CREATE POLICY "collections_public_read"
      ON collections FOR SELECT
      USING (active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'collection_products' AND policyname = 'collection_products_public_read'
  ) THEN
    CREATE POLICY "collection_products_public_read"
      ON collection_products FOR SELECT
      USING (true);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION set_collections_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS collections_set_updated_at ON collections;
CREATE TRIGGER collections_set_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION set_collections_updated_at();
