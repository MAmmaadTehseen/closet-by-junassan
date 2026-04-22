"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Lang = "en" | "ur";

export default function LangToggle() {
  const [lang, setLang] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const match = document.cookie.match(/closet-lang=(en|ur)/);
    setLang((match?.[1] as Lang) ?? "en");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Lang = lang === "ur" ? "en" : "ur";
    document.cookie = `closet-lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setLang(next);
    if (next === "ur") document.documentElement.setAttribute("lang", "ur");
    else document.documentElement.setAttribute("lang", "en");
    startTransition(() => router.refresh());
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${lang === "en" ? "Urdu" : "English"}` : "Language"}
      className="rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink hover:bg-cream focus-ring"
    >
      {mounted ? (lang === "ur" ? "English" : "اردو") : "EN"}
    </button>
  );
}
