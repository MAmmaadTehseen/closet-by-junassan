export interface JournalPost {
  slug: string;
  title: string;
  dek: string;
  category: "Style" | "Sourcing" | "Care" | "Stories";
  date: string;
  readMinutes: number;
  cover: string;
  author: string;
  body: string[];
}

export const JOURNAL: JournalPost[] = [
  {
    slug: "thrift-without-looking-thrift",
    title: "Thrift without looking thrift",
    dek: "Five rules our stylist breaks every week — and one she never does.",
    category: "Style",
    date: "2026-04-18",
    readMinutes: 4,
    author: "Minahil Q.",
    cover:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=70",
    body: [
      "Pakistani thrift has a silhouette problem. Too big, too long, too much of everything. You end up looking like the shirt is wearing you.",
      "Start with fit. If there is one rule we keep every week, this is it — the shoulder seam has to land where your shoulder ends. Everything else can be tailored for Rs 400.",
      "Next, mix one tired piece with one sharp piece. A soft, washed-out oversized tee needs a crisp trouser. A thrashed denim needs a pressed shirt. Never two tired, never two sharp.",
      "And finally — buy for the body you have today, not the one you are planning on.",
    ],
  },
  {
    slug: "inside-the-warehouse",
    title: "Inside the warehouse — how a piece arrives in your parcel",
    dek: "From a bale in Karachi to your doorstep in Islamabad, photographed.",
    category: "Sourcing",
    date: "2026-04-10",
    readMinutes: 6,
    author: "Hassan T.",
    cover:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=70",
    body: [
      "Every Monday morning, a 60kg bale is cut open on our sorting table. What is inside is a lottery — sometimes ten jackets, sometimes one.",
      "Each piece is checked under daylight. Holes, stains, broken zips — if we can fix it, it goes to the tailor. If we cannot, it goes to the donation pile.",
      "The survivors get washed twice — once cold, once hot — then steamed, photographed, and listed. The whole process takes nine working days.",
    ],
  },
  {
    slug: "how-to-wash-preloved-denim",
    title: "How to wash preloved denim (and actually keep it)",
    dek: "Hot water will ruin your favourite thrift find. Here's the cold truth.",
    category: "Care",
    date: "2026-03-28",
    readMinutes: 3,
    author: "Ayesha K.",
    cover:
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=1600&q=70",
    body: [
      "Preloved denim has already shrunk, faded and softened. Your job is to keep it that way.",
      "Turn the jean inside out. Cold cycle. No fabric softener (it breaks down cotton fibres). Hang dry in the shade — direct sun will yellow white stitching.",
      "If it smells after a workout — freeze it in a plastic bag overnight. It really works.",
    ],
  },
  {
    slug: "meet-noor-community-pick",
    title: "Meet Noor — community pick of the month",
    dek: "An architect in Lahore on rebuilding her closet with nothing under Rs 3000.",
    category: "Stories",
    date: "2026-03-14",
    readMinutes: 5,
    author: "Closet Team",
    cover:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=70",
    body: [
      "Noor rebuilt her entire work wardrobe over six months using only thrift. We sat down with her in Lahore to see how she did it.",
      "Her rule — never buy anything on the first visit. Take a photo, walk home, sleep on it. If you are still thinking about the shirt next morning, go back.",
      "Her favourite piece? A charcoal Uniqlo blazer she paid Rs 1200 for, from our winter drop. Wears it twice a week.",
    ],
  },
];

export function findPost(slug: string) {
  return JOURNAL.find((p) => p.slug === slug);
}
