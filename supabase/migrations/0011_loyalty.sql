-- ============================================================
-- Migration 0011: Closet Coins — loyalty points ledger
-- ============================================================
-- Keyed by phone (natural identity). Every delivered order earns 1 point per Rs 10.
-- Checkout redemptions debit. A view sums to a live balance per phone.

CREATE TABLE IF NOT EXISTS loyalty_ledger (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone        text NOT NULL,
  order_id     uuid REFERENCES orders(id) ON DELETE SET NULL,
  delta_points int  NOT NULL,
  reason       text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS loyalty_ledger_phone_idx
  ON loyalty_ledger (phone, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS loyalty_ledger_order_credit_unique
  ON loyalty_ledger (order_id, reason)
  WHERE reason = 'order_delivered';

ALTER TABLE loyalty_ledger ENABLE ROW LEVEL SECURITY;
-- No public read/write — admin (service role) bypasses RLS.

CREATE OR REPLACE VIEW loyalty_balance AS
  SELECT phone, COALESCE(SUM(delta_points), 0)::int AS balance
  FROM loyalty_ledger
  GROUP BY phone;
