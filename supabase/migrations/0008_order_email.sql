-- ============================================================
-- Migration 0008: Optional customer email on orders
-- ============================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS email text;

CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (email);
