-- ============================================================
-- Migration 0016: Scheduled activation windows
-- ============================================================

ALTER TABLE drops ADD COLUMN IF NOT EXISTS goes_live_at timestamptz;
ALTER TABLE drops ADD COLUMN IF NOT EXISTS ends_at      timestamptz;

ALTER TABLE bundles ADD COLUMN IF NOT EXISTS goes_live_at timestamptz;
ALTER TABLE bundles ADD COLUMN IF NOT EXISTS ends_at      timestamptz;

CREATE INDEX IF NOT EXISTS drops_schedule_idx   ON drops   (goes_live_at, ends_at);
CREATE INDEX IF NOT EXISTS bundles_schedule_idx ON bundles (goes_live_at, ends_at);
