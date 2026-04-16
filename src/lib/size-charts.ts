import type { Category } from "./types";

export interface SizeChart {
  category: Category;
  label: string;
  headers: string[];
  rows: string[][];
  tip?: string;
}

export const SIZE_CHARTS: SizeChart[] = [
  {
    category: "men",
    label: "Men",
    headers: ["Size", "Chest (in)", "Waist (in)", "Length (in)", "Shoulder (in)"],
    rows: [
      ["S", "36–38", "28–30", "27", "16.5"],
      ["M", "39–41", "31–33", "28", "17.5"],
      ["L", "42–44", "34–36", "29", "18.5"],
      ["XL", "45–47", "37–40", "30", "19.5"],
    ],
    tip: "Lay a shirt you love flat and measure across the chest, shoulder to shoulder, and collar to hem.",
  },
  {
    category: "women",
    label: "Women",
    headers: ["Size", "Bust (in)", "Waist (in)", "Hips (in)", "Length (in)"],
    rows: [
      ["S", "33–35", "25–27", "35–37", "24–25"],
      ["M", "36–38", "28–30", "38–40", "25–26"],
      ["L", "39–41", "31–33", "41–43", "26–27"],
      ["XL", "42–44", "34–36", "44–46", "27–28"],
    ],
    tip: "For dresses and skirts, measure from the natural waist to where you want the hem to fall.",
  },
  {
    category: "kids",
    label: "Kids",
    headers: ["Size", "Age", "Chest (in)", "Height (cm)", "Waist (in)"],
    rows: [
      ["S", "3–5 yrs", "22–24", "98–110", "20–21"],
      ["M", "6–8 yrs", "25–27", "116–128", "21–23"],
      ["L", "9–11 yrs", "28–30", "134–146", "23–25"],
      ["XL", "12–14 yrs", "31–33", "152–164", "25–27"],
    ],
    tip: "Kids sizes vary a lot by brand. We recommend checking the measurements rather than the age label.",
  },
  {
    category: "shoes",
    label: "Shoes",
    headers: ["EU", "UK", "US (M)", "US (W)", "Foot length (cm)"],
    rows: [
      ["38", "5", "6", "7.5", "24"],
      ["39", "6", "7", "8.5", "24.5"],
      ["40", "7", "7.5", "9", "25.5"],
      ["41", "7.5", "8", "9.5", "26"],
      ["42", "8", "9", "10.5", "26.5"],
      ["43", "9", "10", "11.5", "27.5"],
      ["44", "10", "11", "12", "28.5"],
    ],
    tip: "Stand on a piece of paper, trace your foot, and measure the longest length in cm. Match to the chart.",
  },
  {
    category: "bags",
    label: "Bags",
    headers: ["Type", "Width (in)", "Height (in)", "Depth (in)", "Fits"],
    rows: [
      ["Mini crossbody", "6–8", "5–6", "2–3", "Phone, keys, wallet"],
      ["Crossbody", "9–11", "7–8", "3–4", "Essentials + tablet"],
      ["Tote", "13–16", "11–13", "5–6", "Laptop + daily carry"],
      ["Backpack", "11–13", "15–17", "5–7", "Books, laptop, gym kit"],
      ["Clutch / evening", "9–11", "5–7", "1–2", "Phone, cards, lipstick"],
    ],
    tip: "Bag dimensions are listed on each product page. Use a ruler to visualize the size before ordering.",
  },
];

export function getSizeChart(category: Category): SizeChart {
  return SIZE_CHARTS.find((c) => c.category === category) ?? SIZE_CHARTS[0];
}
