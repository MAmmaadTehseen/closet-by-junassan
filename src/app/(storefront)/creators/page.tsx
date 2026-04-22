import type { Metadata } from "next";
import { Camera, Coins, Users, Sparkles } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { siteConfig, waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Creators & Affiliates",
  description:
    "Earn commission styling Closet by Junassan. Apply to our creator program.",
};

const PERKS = [
  {
    icon: <Coins className="h-5 w-5" />,
    title: "10–15% commission",
    desc: "Earn on every order placed with your unique code. Paid monthly via Easypaisa / bank.",
  },
  {
    icon: <Camera className="h-5 w-5" />,
    title: "Free pieces to style",
    desc: "Handpicked drops sent to you to shoot, wear, and keep. No strings attached.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Early access to drops",
    desc: "Shop new stock 24 hours before anyone else — first pick, every drop.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Feature on our grid",
    desc: "Your look reposted to our 30k+ audience. Tag @closetbyjunassan to get seen.",
  },
];

export default function CreatorsPage() {
  const subject = encodeURIComponent("Creator program application");
  const body = encodeURIComponent(
    "Hi Closet team!\n\nInstagram handle: @\nTikTok handle: @\nFollowers: \nCity: \nWhy I'd love to collab:\n\nThanks!",
  );
  const mail = `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow mb-3">For creators &amp; resellers</p>
      <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
        Style it. Share it. <span className="italic text-ink/70">Earn on it.</span>
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Pakistani creators building something real — we&apos;d love to work with
        you. No rigid quotas, no scripts. Wear what feels like you and we&apos;ll
        send you a payout on every order your code brings in.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {PERKS.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-border bg-paper p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper">
              {p.icon}
            </div>
            <p className="mt-4 font-display text-lg font-semibold">{p.title}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-ink bg-ink p-8 text-paper sm:p-12">
        <p className="eyebrow mb-3 text-paper/70">Apply</p>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          Send us your handle
        </h2>
        <p className="mt-3 max-w-md text-sm text-paper/70">
          Drop us your Instagram handle, follower count, and a note about why
          you&apos;d like to collab. We reply to everyone within 48 hours.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={mail}
            className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink hover:opacity-90"
          >
            Apply via email
          </a>
          <a
            href={waLink("Hi! I'd like to apply to the creator program.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-paper hover:bg-paper hover:text-ink"
          >
            WhatsApp us
          </a>
          <a
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-paper hover:bg-paper hover:text-ink"
          >
            <InstagramIcon className="h-3.5 w-3.5" /> DM on Instagram
          </a>
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        <p className="font-semibold text-ink">Who we&apos;re looking for</p>
        <ul className="mt-2 list-disc pl-5 leading-relaxed">
          <li>Micro-creators (2k+) with a clear POV — beats follower count any day.</li>
          <li>Resellers &amp; stylists based anywhere in Pakistan.</li>
          <li>Students running thrift content — yes, we see you.</li>
        </ul>
      </div>
    </div>
  );
}
