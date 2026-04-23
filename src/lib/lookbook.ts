export interface LookbookEdit {
  slug: string;
  title: string;
  subtitle: string;
  cover: string;
  palette: string[];
  mood: string;
  story: string;
}

export const LOOKBOOK: LookbookEdit[] = [
  {
    slug: "karachi-sunset",
    title: "Karachi Sunset",
    subtitle: "Rust, terracotta, and a linen breeze.",
    cover:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1600&q=80",
    palette: ["#c1121f", "#e2a36c", "#f1ede4", "#3a2b22"],
    mood: "Slow evenings, sea-salt hair, the light right before the azaan.",
    story:
      "A capsule built around warm-neutral staples and one tactical pop of rust. Works for a rooftop dinner or a walk down Do Darya.",
  },
  {
    slug: "islamabad-pine",
    title: "Islamabad Pine",
    subtitle: "Forest green meets clean-cut tailoring.",
    cover:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80",
    palette: ["#2f3e2b", "#d9d1be", "#111111", "#7a6a55"],
    mood: "Cold mornings, F6 walks, Marrakech coffee windows down.",
    story:
      "Dark neutrals, crisp shirts, heritage loafers. A grown-up city uniform that still breathes on a hike.",
  },
  {
    slug: "lahore-nights",
    title: "Lahore Nights",
    subtitle: "Ink. Cream. A hint of gold.",
    cover:
      "https://images.unsplash.com/photo-1520975918318-7a8f85a8b33f?auto=format&fit=crop&w=1600&q=80",
    palette: ["#0a0a0a", "#faf9f6", "#c0a26b", "#4b3820"],
    mood: "MM Alam dinners, old-city walks, Sufi night drives.",
    story:
      "Sharp contrast, sculpted silhouettes, statement outerwear. Built for evenings that turn into mornings.",
  },
  {
    slug: "weekend-studio",
    title: "Weekend Studio",
    subtitle: "Soft denim, heavy cotton, zero fuss.",
    cover:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80",
    palette: ["#4a6277", "#e8e2d5", "#a0876b", "#1c1917"],
    mood: "Home office, specialty coffee, a film-camera in the back pocket.",
    story:
      "Easy layers with just enough structure. The kind of fit that photographs well even when you’re not trying.",
  },
];
