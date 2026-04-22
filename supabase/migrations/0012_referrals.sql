-- ============================================================
-- Migration 0012: Referral codes
-- ============================================================

CREATE TABLE IF NOT EXISTS referrals (
  code            text PRIMARY KEY,
  referrer_phone  text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS referrals_phone_unique
  ON referrals (referrer_phone);

CREATE TABLE IF NOT EXISTS referral_uses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL REFERENCES referrals(code) ON DELETE CASCADE,
  order_id    uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  discount    int  NOT NULL DEFAULT 200,
  credited    boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id)
);

CREATE INDEX IF NOT EXISTS referral_uses_code_idx
  ON referral_uses (code, created_at DESC);

ALTER TABLE referrals     ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_uses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'referrals' AND policyname = 'referrals_public_read'
  ) THEN
    CREATE POLICY "referrals_public_read"
      ON referrals FOR SELECT
      USING (true);
  END IF;
END $$;
