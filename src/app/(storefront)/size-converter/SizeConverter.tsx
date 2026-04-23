"use client";

import { useState } from "react";

type Kind = "women-tops" | "men-tops" | "women-bottoms" | "men-bottoms" | "shoes-women" | "shoes-men";

const TABLES: Record<Kind, { headers: string[]; rows: string[][] }> = {
  "women-tops": {
    headers: ["PK / Alpha", "US", "UK", "EU"],
    rows: [
      ["XS", "0", "4", "32"],
      ["S", "2–4", "6–8", "34–36"],
      ["M", "6–8", "10–12", "38–40"],
      ["L", "10–12", "14–16", "42–44"],
      ["XL", "14–16", "18–20", "46–48"],
      ["XXL", "18–20", "22–24", "50–52"],
    ],
  },
  "men-tops": {
    headers: ["PK / Alpha", "US Chest (in)", "UK", "EU"],
    rows: [
      ["S", "34–36", "S", "46"],
      ["M", "38–40", "M", "48–50"],
      ["L", "42–44", "L", "52"],
      ["XL", "46–48", "XL", "54"],
      ["XXL", "50–52", "XXL", "56"],
    ],
  },
  "women-bottoms": {
    headers: ["PK / Alpha", "US Waist", "UK", "EU"],
    rows: [
      ["XS", "24", "4", "32"],
      ["S", "26–27", "6–8", "34–36"],
      ["M", "28–29", "10–12", "38–40"],
      ["L", "30–31", "14–16", "42–44"],
      ["XL", "32–34", "18–20", "46–48"],
    ],
  },
  "men-bottoms": {
    headers: ["Waist (in)", "PK", "US", "EU"],
    rows: [
      ["28", "S", "28", "44"],
      ["30", "M", "30", "46"],
      ["32", "M/L", "32", "48"],
      ["34", "L", "34", "50"],
      ["36", "XL", "36", "52"],
      ["38", "XXL", "38", "54"],
    ],
  },
  "shoes-women": {
    headers: ["PK / US", "UK", "EU", "CM"],
    rows: [
      ["5", "3", "35.5", "22.0"],
      ["6", "4", "36.5", "22.9"],
      ["7", "5", "37.5", "23.5"],
      ["8", "6", "38.5", "24.1"],
      ["9", "7", "40", "25.4"],
      ["10", "8", "41", "26.2"],
    ],
  },
  "shoes-men": {
    headers: ["PK / US", "UK", "EU", "CM"],
    rows: [
      ["7", "6", "40", "25.0"],
      ["8", "7", "41", "26.0"],
      ["9", "8", "42", "26.7"],
      ["10", "9", "43", "27.3"],
      ["11", "10", "44", "28.0"],
      ["12", "11", "45", "29.0"],
    ],
  },
};

export default function SizeConverter() {
  const [kind, setKind] = useState<Kind>("women-tops");
  const [selected, setSelected] = useState<string | null>(null);
  const t = TABLES[kind];

  const kinds: { k: Kind; label: string }[] = [
    { k: "women-tops", label: "Women · Tops" },
    { k: "men-tops", label: "Men · Tops" },
    { k: "women-bottoms", label: "Women · Bottoms" },
    { k: "men-bottoms", label: "Men · Bottoms" },
    { k: "shoes-women", label: "Shoes · Women" },
    { k: "shoes-men", label: "Shoes · Men" },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {kinds.map((k) => (
          <button
            key={k.k}
            onClick={() => {
              setKind(k.k);
              setSelected(null);
            }}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
              kind === k.k ? "border-ink bg-ink text-paper" : "border-border hover:border-ink"
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-paper">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <tr>
              {t.headers.map((h) => (
                <th key={h} className="px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {t.rows.map((r, i) => {
              const key = r.join("|");
              const active = selected === key;
              return (
                <tr
                  key={i}
                  onClick={() => setSelected(active ? null : key)}
                  className={`cursor-pointer transition ${
                    active ? "bg-ink text-paper" : "hover:bg-cream/50"
                  }`}
                >
                  {r.map((c, j) => (
                    <td key={j} className="px-4 py-3 font-medium">
                      {c}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Tap a row to highlight your equivalent sizes across systems.
      </p>
    </div>
  );
}
