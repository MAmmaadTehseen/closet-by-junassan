-- ============================================================
-- Migration 0014: Site settings (KV)
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'site_settings_public_read'
  ) THEN
    CREATE POLICY "site_settings_public_read"
      ON site_settings FOR SELECT
      USING (true);
  END IF;
END $$;
