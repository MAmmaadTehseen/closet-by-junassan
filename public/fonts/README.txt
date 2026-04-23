Currently, the site uses Playfair Display (Google Font, OFL — free for commercial use),
loaded via `next/font/google` in `src/app/layout.tsx`. No local font file is required
for the build to succeed.

Ceramic (the original intended display face) is donationware on DaFont — free for
personal use only, commercial use requires contacting the author for a paid license.

If you obtain a commercial Ceramic license and want to swap it back in:

  1. Drop the file here as `Ceramic.otf` (or split weights as `Ceramic-Regular.otf`,
     `Ceramic-Medium.otf`, `Ceramic-Bold.otf`, `Ceramic-Italic.otf`).
  2. In `src/app/layout.tsx`, replace the `Playfair_Display` import with:
        import localFont from "next/font/local";
     and the font config with:
        const ceramic = localFont({
          src: [{ path: "../../public/fonts/Ceramic.otf", weight: "400", style: "normal" }],
          variable: "--font-ceramic",
          display: "swap",
          fallback: ["Georgia", "ui-serif", "serif"],
        });

The CSS variable is already named `--font-ceramic`, so no globals.css changes are
needed.
