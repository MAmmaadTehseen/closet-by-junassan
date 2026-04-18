-- ============================================================
-- Migration 0013: Price-drop alert subscriptions
-- ============================================================

CREATE TABLE IF NOT EXISTS price_alerts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  phone            text,
  email            text,
  cap_price_pkr    int  NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  notified_at      timestamptz
);

CREATE INDEX IF NOT EXISTS price_alerts_product_idx
  ON price_alerts (product_id, notified_at);

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
-- Inserts happen via server action (service role) — no public policy needed.
