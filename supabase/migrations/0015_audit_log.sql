-- ============================================================
-- Migration 0015: Admin audit log
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor       text NOT NULL DEFAULT 'admin',
  action      text NOT NULL,
  entity      text NOT NULL,
  entity_id   text,
  summary     text,
  diff        jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_log_entity_idx ON audit_log (entity, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_log_created_idx ON audit_log (created_at DESC);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
-- Service role bypasses — no public policy.
