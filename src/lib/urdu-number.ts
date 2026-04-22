/**
 * Pakistani-style (lakh/crore) word form for small-to-mid rupee amounts,
 * written in Urdu script. Good for display lines up to ~99,99,999.
 */

const ONES = [
  "", "ایک", "دو", "تین", "چار", "پانچ", "چھ", "سات", "آٹھ", "نو",
  "دس", "گیارہ", "بارہ", "تیرہ", "چودہ", "پندرہ", "سولہ", "سترہ", "اٹھارہ", "انیس",
];

const TENS = [
  "", "", "بیس", "تیس", "چالیس", "پچاس", "ساٹھ", "ستر", "اسی", "نوے",
];

function wordsBelowHundred(n: number): string {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const r = n % 10;
  if (r === 0) return TENS[t];
  return `${ONES[r]} ${TENS[t]}`.trim();
}

function wordsBelowThousand(n: number): string {
  if (n < 100) return wordsBelowHundred(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  const head = `${ONES[h]} سو`;
  return r === 0 ? head : `${head} ${wordsBelowHundred(r)}`;
}

/** Convert a whole PKR amount into an Urdu transliteration, e.g. "ایک ہزار پانچ سو روپے". */
export function pkrToUrduWords(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "صفر روپے";
  const n = Math.round(amount);

  const parts: string[] = [];
  const crore = Math.floor(n / 10_000_000);
  const lakh = Math.floor((n % 10_000_000) / 100_000);
  const thousand = Math.floor((n % 100_000) / 1_000);
  const rest = n % 1_000;

  if (crore > 0) parts.push(`${wordsBelowHundred(crore)} کروڑ`);
  if (lakh > 0) parts.push(`${wordsBelowHundred(lakh)} لاکھ`);
  if (thousand > 0) parts.push(`${wordsBelowHundred(thousand)} ہزار`);
  if (rest > 0) parts.push(wordsBelowThousand(rest));

  return `${parts.join(" ")} روپے`.replace(/\s+/g, " ").trim();
}
