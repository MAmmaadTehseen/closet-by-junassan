-- ============================================================
-- Migration 0020: Abandoned cart recovery
-- ============================================================

CREATE TABLE IF NOT EXISTS cart_recoveries (
  token         text PRIMARY KEY,
  email         text NOT NULL,
  items_json    jsonb NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  notified_at   timestamptz,
  recovered_at  timestamptz
);

CREATE INDEX IF NOT EXISTS cart_recoveries_pending_idx
  ON cart_recoveries (notified_at, created_at);

CREATE INDEX IF NOT EXISTS cart_recoveries_email_idx
  ON cart_recoveries (email);

ALTER TABLE cart_recoveries ENABLE ROW LEVEL SECURITY;
-- Service role only.
