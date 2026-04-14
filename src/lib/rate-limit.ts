import "server-only";
import { createHash } from "crypto";

/**
 * Tiny in-process LRU rate limiter + idempotency cache.
 * Adequate for a single-instance Vercel/Next deployment. For production-scale,
 * swap with Upstash Redis.
 */

interface Entry {
  hits: number[];
  last: number;
}

const BUCKET = new Map<string, Entry>();
const IDEMPOTENCY = new Map<string, { at: number; orderCode: string }>();
const MAX_KEYS = 500;

export function hashKey(...parts: (string | null | undefined)[]): string {
  return createHash("sha256").update(parts.filter(Boolean).join("|")).digest("hex").slice(0, 32);
}

function cleanup() {
  if (BUCKET.size <= MAX_KEYS && IDEMPOTENCY.size <= MAX_KEYS) return;
  const now = Date.now();
  for (const [k, v] of BUCKET) {
    if (now - v.last > 60 * 60 * 1000) BUCKET.delete(k);
  }
  for (const [k, v] of IDEMPOTENCY) {
    if (now - v.at > 15 * 60 * 1000) IDEMPOTENCY.delete(k);
  }
}

/** Returns true if allowed, false if over limit. */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  cleanup();
  const now = Date.now();
  const e = BUCKET.get(key) ?? { hits: [], last: now };
  e.hits = e.hits.filter((t) => now - t < windowMs);
  if (e.hits.length >= max) {
    e.last = now;
    BUCKET.set(key, e);
    return false;
  }
  e.hits.push(now);
  e.last = now;
  BUCKET.set(key, e);
  return true;
}

export function rememberIdempotency(key: string, orderCode: string) {
  IDEMPOTENCY.set(key, { at: Date.now(), orderCode });
}

export function seenIdempotency(key: string): string | null {
  const e = IDEMPOTENCY.get(key);
  if (!e) return null;
  if (Date.now() - e.at > 15 * 60 * 1000) {
    IDEMPOTENCY.delete(key);
    return null;
  }
  return e.orderCode;
}
