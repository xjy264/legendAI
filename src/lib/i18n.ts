import "server-only";

export const locales = ["zh", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

export function isLocale(value: string): value is Locale {
  return value === "zh" || value === "en";
}

export function getLocaleFromHeader(value: string | null | undefined): Locale {
  return value === "en" ? "en" : "zh";
}

export function localizedPath(locale: Locale, path: string) {
  if (locale === "en") {
    return path === "/" ? "/en" : `/en${path}`;
  }

  return path;
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}

