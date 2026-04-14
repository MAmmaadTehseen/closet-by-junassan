export function formatPKR(amount: number): string {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

export function pluralize(n: number, singular: string, plural?: string): string {
  return n === 1 ? singular : plural ?? `${singular}s`;
}

export function formatCondition(condition: string): string {
  if (!condition) return "";
  if (condition.includes("/")) return `${condition} condition`;
  return condition;
}

/** Deterministic pseudo-random in [0,1) from a string seed. */
export function seededRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

export function shortOrderCode(uuid?: string): string {
  const src = uuid ?? (typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}`);
  return "CBJ-" + src.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase();
}
