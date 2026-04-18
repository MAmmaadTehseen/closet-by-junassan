-- ============================================================
-- Migration 0019: Shop-by-style mood boards
-- ============================================================

CREATE TABLE IF NOT EXISTS styles (
  slug          text PRIMARY KEY,
  label         text NOT NULL,
  description   text,
  cover_image   text,
  sort_order    int  NOT NULL DEFAULT 0,
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS styles_active_sort_idx ON styles (active, sort_order);

ALTER TABLE styles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'styles' AND policyname = 'styles_public_read'
  ) THEN
    CREATE POLICY "styles_public_read"
      ON styles FOR SELECT
      USING (active = true);
  END IF;
END $$;
