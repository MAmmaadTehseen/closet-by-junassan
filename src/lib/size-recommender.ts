export type FitPreference = "slim" | "regular" | "relaxed";

export interface MeasurementInput {
  heightCm: number;
  chestCm: number;
  waistCm: number;
  weightKg: number;
  fit: FitPreference;
}

export type RecommendedSize = "S" | "M" | "L" | "XL";

/**
 * Recommends a size using a simple rules engine built from common
 * South-Asian men/women size charts (chest + waist are the strongest signals).
 * Fit preference shifts the result up/down by one step.
 */
export function recommendSize(input: MeasurementInput): {
  size: RecommendedSize;
  reason: string;
  confidence: "low" | "medium" | "high";
} {
  const { chestCm, waistCm, weightKg, fit } = input;

  const base: RecommendedSize[] = ["S", "M", "L", "XL"];
  let score = 0;

  // Chest score
  if (chestCm < 92) score += 0;
  else if (chestCm < 100) score += 1;
  else if (chestCm < 108) score += 2;
  else score += 3;

  // Waist score
  if (waistCm < 76) score += 0;
  else if (waistCm < 84) score += 1;
  else if (waistCm < 92) score += 2;
  else score += 3;

  // Weight score
  if (weightKg < 58) score += 0;
  else if (weightKg < 72) score += 1;
  else if (weightKg < 86) score += 2;
  else score += 3;

  // Average score across the three signals
  let idx = Math.round(score / 3);

  // Apply fit preference
  if (fit === "slim") idx = Math.max(0, idx - 1);
  if (fit === "relaxed") idx = Math.min(3, idx + 1);
  idx = Math.max(0, Math.min(3, idx));

  const size = base[idx];

  const chestBorderline =
    chestCm > 0 && Math.abs(chestCm - [88, 96, 104, 112][idx]) < 3;
  const waistBorderline =
    waistCm > 0 && Math.abs(waistCm - [72, 80, 88, 96][idx]) < 3;

  const confidence =
    chestBorderline || waistBorderline ? "medium" : chestCm && waistCm ? "high" : "low";

  const reason = `Based on chest ${chestCm}cm, waist ${waistCm}cm, weight ${weightKg}kg and ${fit} fit.`;
  return { size, reason, confidence };
}
