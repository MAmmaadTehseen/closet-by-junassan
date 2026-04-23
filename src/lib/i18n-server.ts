import "server-only";
import { cookies } from "next/headers";
import { t, COOKIE_KEY, DEFAULT_LANG, type Lang, type TranslationKey } from "./i18n";

export async function getLang(): Promise<Lang> {
  try {
    const store = await cookies();
    const v = store.get(COOKIE_KEY)?.value;
    return v === "ur" ? "ur" : "en";
  } catch {
    return DEFAULT_LANG;
  }
}

/** Create a translator bound to the current request's language. RSC-only. */
export async function getT(): Promise<(key: TranslationKey, vars?: Record<string, string>) => string> {
  const lang = await getLang();
  return (key, vars) => t(key, lang, vars);
}
