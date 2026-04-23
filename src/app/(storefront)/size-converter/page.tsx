import type { Metadata } from "next";
import SizeConverter from "./SizeConverter";

export const metadata: Metadata = {
  title: "Size Converter",
  description:
    "Translate any size tag into the one you wear — tops, bottoms, shoes, across US, UK, EU and PK.",
};

export default function SizeConverterPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-2">Tag maze? Solved.</p>
        <h1 className="font-display text-3xl font-semibold sm:text-5xl">Size Converter</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Every piece we stock was tagged in a different country. Pick the system on the tag,
          your size, and see the rest line up.
        </p>
      </div>
      <SizeConverter />
    </div>
  );
}
