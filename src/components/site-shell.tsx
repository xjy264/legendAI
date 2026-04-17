import Link from "next/link";

import { Locale, localizedPath, oppositeLocale } from "@/lib/i18n";

type SiteContent = ReturnType<typeof import("@/lib/site-content").getSiteContent>;

export function SiteShell({
  children,
  locale,
  content,
}: {
  children: React.ReactNode;
  locale: Locale;
  content: SiteContent;
}) {
  const alternateLocale = oppositeLocale(locale);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(12,180,166,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_24%),linear-gradient(180deg,#f7f4ee_0%,#f2efe7_48%,#ede8dd_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(15,23,42,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.3)_1px,transparent_1px)] [background-size:84px_84px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-20 mb-8 rounded-full border border-black/10 bg-white/70 px-4 py-3 shadow-[0_12px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <Link href={localizedPath(locale, "/")} className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                {content.site.shortName}
              </span>
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
                  {locale === "zh" ? "个人技术栈" : "Personal stack"}
                </p>
                <p className="text-sm text-slate-900">{content.site.name}</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {content.nav.map((item) => (
                <Link
                  key={item.path}
                  href={localizedPath(locale, item.path)}
                  className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-950 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href={localizedPath(alternateLocale, "/")}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                {content.switcher.label}
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-12 border-t border-black/10 py-6 text-sm text-slate-600">
          <p>{content.common.footer}</p>
        </footer>
      </div>
    </div>
  );
}
