export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  author: string;
  date: string; // ISO
  tag: "style" | "care" | "guide" | "behind-the-scenes";
  readTime: number; // minutes
  body: string[]; // paragraphs
}

export const JOURNAL: JournalPost[] = [
  {
    slug: "how-to-spot-real-denim",
    title: "How to spot real denim (in 30 seconds)",
    excerpt: "Selvedge, stitching, rivets, and the smell test. A field guide for thrift hunters.",
    cover:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1400&q=80",
    author: "Junassan",
    date: "2026-04-04",
    tag: "guide",
    readTime: 4,
    body: [
      "When you&apos;re thrift hunting, you can&apos;t rely on the label alone. Real selvedge denim has a clean, white-ish strip inside the cuff. Fast-fashion jeans skip this.",
      "Check the rivets. Copper, branded, and set deep means quality. Thin, silver, or loose rivets are a tell.",
      "Smell test: real denim smells like indigo and cotton. Polyester blends smell chemical — pass.",
      "Finally, the stretch test. Pinch the fabric. Quality denim rebounds crisp; cheap denim stays wrinkled.",
    ],
  },
  {
    slug: "care-for-preloved-pieces",
    title: "Caring for preloved pieces",
    excerpt: "Wash less, spot-clean more, and this one trick to keep colours forever.",
    cover:
      "https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&w=1400&q=80",
    author: "Junassan",
    date: "2026-03-20",
    tag: "care",
    readTime: 3,
    body: [
      "Thrifted clothes have already lived a life. Treat them gently and they&apos;ll go another 5 years.",
      "Wash inside out in cold water. Skip the tumble dryer — hang dry indoors, out of direct sun.",
      "For darks, add a quarter cup of white vinegar on the first wash. It locks in dye and cuts any odour.",
      "Spot-clean before a full wash. Most stains are water + baking soda jobs.",
    ],
  },
  {
    slug: "building-a-ten-piece-capsule",
    title: "The 10-piece Pakistani capsule",
    excerpt: "Desi humidity, office-to-dinner, no-ironing-possible. Here’s what actually works.",
    cover:
      "https://images.unsplash.com/photo-1520975954732-35dd202b8b9d?auto=format&fit=crop&w=1400&q=80",
    author: "Junassan",
    date: "2026-02-28",
    tag: "style",
    readTime: 6,
    body: [
      "A capsule in Karachi is not a capsule in London. You need breathable fabrics, wrinkle-resistance, and layer-ability for a power-cut evening.",
      "Start with two white tees (one fitted, one oversized), one neutral overshirt, one straight-leg jean, one relaxed trouser, one black slip dress or shalwar, a silk/satin top for dinners, a linen shirt, canvas sneakers, and one good tote.",
      "Mix ratio: 70% neutrals, 30% colour. The colour piece rotates by season — rust in autumn, sage in spring.",
      "Everything should layer with everything else. If a piece only works one way, it&apos;s not earning its shelf.",
    ],
  },
  {
    slug: "behind-a-drop",
    title: "Behind a drop — how we curate",
    excerpt: "A Monday-to-Friday look at sourcing, inspecting, shooting, and listing 40+ pieces.",
    cover:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1400&q=80",
    author: "Junassan",
    date: "2026-02-08",
    tag: "behind-the-scenes",
    readTime: 5,
    body: [
      "Every drop starts with a three-day hunt across 4-5 wholesale lots. We look for labels, not just logos.",
      "Back at the studio, each piece gets inspected under natural light, measured, and graded 1-10. Anything below 7 doesn&apos;t make the site.",
      "Then it&apos;s shot in a consistent lightbox setup, listed with measurements to the nearest quarter inch, and priced to move.",
      "We intentionally cap each drop at 40-50 pieces so we can focus on quality and personal styling.",
    ],
  },
];
