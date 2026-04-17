-- ============================================================
-- Migration 0006: Homepage "Drops" stories
-- ============================================================

CREATE TABLE IF NOT EXISTS drops (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  subtitle     text,
  cover_image  text NOT NULL,
  cta_label    text,
  cta_href     text,
  sort_order   int  NOT NULL DEFAULT 0,
  active       boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS drops_active_sort_idx
  ON drops (active, sort_order, published_at DESC);

ALTER TABLE drops ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'drops' AND policyname = 'drops_public_read'
  ) THEN
    CREATE POLICY "drops_public_read"
      ON drops FOR SELECT
      USING (active = true);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION set_drops_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS drops_set_updated_at ON drops;
CREATE TRIGGER drops_set_updated_at
  BEFORE UPDATE ON drops
  FOR EACH ROW EXECUTE FUNCTION set_drops_updated_at();
