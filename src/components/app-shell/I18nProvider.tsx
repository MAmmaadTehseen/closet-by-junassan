"use client";

import { createContext, useMemo, type ReactNode } from "react";
import { t, type Lang, type TranslationKey } from "@/lib/i18n";

export type Translator = (key: TranslationKey, vars?: Record<string, string>) => string;

export const I18nContext = createContext<{ lang: Lang; t: Translator }>({
  lang: "en",
  t: (key) => key as string,
});

export default function I18nProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ lang, t: ((key, vars) => t(key, lang, vars)) as Translator }),
    [lang],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
