export type ZoneKey = "metro" | "punjab" | "sindh" | "kp-balochistan" | "north";

export interface Zone {
  key: ZoneKey;
  label: string;
  minDays: number;
  maxDays: number;
  /** Flat PKR delivery fee for this zone. */
  fee: number;
  /** Order of estimated touchpoints for a tracker preview. */
  steps: string[];
}

export const ZONES: Record<ZoneKey, Zone> = {
  metro: {
    key: "metro",
    label: "Karachi, Lahore, Islamabad metro",
    minDays: 2,
    maxDays: 3,
    fee: 250,
    steps: ["Order confirmed", "Dispatched from studio", "On route in your city", "Courier out for delivery", "Delivered"],
  },
  punjab: {
    key: "punjab",
    label: "Punjab (rest of province)",
    minDays: 3,
    maxDays: 5,
    fee: 300,
    steps: ["Order confirmed", "Dispatched", "Reached regional hub", "Out for delivery", "Delivered"],
  },
  sindh: {
    key: "sindh",
    label: "Sindh (rest of province)",
    minDays: 3,
    maxDays: 5,
    fee: 300,
    steps: ["Order confirmed", "Dispatched", "Reached regional hub", "Out for delivery", "Delivered"],
  },
  "kp-balochistan": {
    key: "kp-balochistan",
    label: "KP & Balochistan",
    minDays: 4,
    maxDays: 7,
    fee: 350,
    steps: ["Order confirmed", "Dispatched", "Transferred to regional courier", "Out for delivery", "Delivered"],
  },
  north: {
    key: "north",
    label: "Gilgit-Baltistan, AJK, remote",
    minDays: 5,
    maxDays: 9,
    fee: 450,
    steps: ["Order confirmed", "Dispatched", "On mountain route", "Regional depot", "Delivered"],
  },
};

const CITY_ZONE: Record<string, ZoneKey> = {
  // Metro
  Karachi: "metro",
  Lahore: "metro",
  Islamabad: "metro",
  Rawalpindi: "metro",
  // Punjab
  Faisalabad: "punjab",
  Multan: "punjab",
  Gujranwala: "punjab",
  Sialkot: "punjab",
  Bahawalpur: "punjab",
  Sargodha: "punjab",
  "Rahim Yar Khan": "punjab",
  Jhang: "punjab",
  Gujrat: "punjab",
  Kasur: "punjab",
  "Dera Ghazi Khan": "punjab",
  Sahiwal: "punjab",
  Okara: "punjab",
  "Wah Cantonment": "punjab",
  Jhelum: "punjab",
  Khanewal: "punjab",
  Chiniot: "punjab",
  Kamoke: "punjab",
  "Mandi Bahauddin": "punjab",
  Attock: "punjab",
  Vehari: "punjab",
  Sheikhupura: "punjab",
  Muzaffargarh: "punjab",
  // Sindh
  Hyderabad: "sindh",
  Sukkur: "sindh",
  Larkana: "sindh",
  Nawabshah: "sindh",
  "Mirpur Khas": "sindh",
  // KP & Balochistan
  Peshawar: "kp-balochistan",
  Quetta: "kp-balochistan",
  Mardan: "kp-balochistan",
  Mingora: "kp-balochistan",
  Abbottabad: "kp-balochistan",
  Kohat: "kp-balochistan",
  Mansehra: "kp-balochistan",
  Chitral: "kp-balochistan",
  Gwadar: "kp-balochistan",
  // North
  Gilgit: "north",
  Skardu: "north",
  Muzaffarabad: "north",
  Kotli: "north",
};

export function zoneForCity(city: string): Zone {
  const key = CITY_ZONE[city];
  return ZONES[key ?? "punjab"];
}

export function estimateDelivery(city: string, orderedAt: Date = new Date()) {
  const zone = zoneForCity(city);
  const min = addBusinessDays(orderedAt, zone.minDays);
  const max = addBusinessDays(orderedAt, zone.maxDays);
  return { zone, earliest: min, latest: max };
}

function addBusinessDays(start: Date, days: number): Date {
  const d = new Date(start);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0) added++; // skip Sundays
  }
  return d;
}
