import Link from "next/link";

import { SiteFooterActions } from "@/components/site-footer-actions";
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
  const brandName = content.site.name;
  const brandVersion = "1.1.1";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10),transparent_30%),linear-gradient(180deg,#f8f5ee_0%,#f3eee5_56%,#ece5d8_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(15,23,42,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.28)_1px,transparent_1px)] [background-size:84px_84px]" />

      <header className="fixed inset-x-0 top-0 z-30 w-full border-b border-black/10 bg-[linear-gradient(180deg,rgba(248,245,238,0.84),rgba(248,245,238,0.66))] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-5 px-3 py-3.5 sm:px-5 sm:py-4 lg:px-6">
          <Link
            href={localizedPath(locale, "/studio/xjy-7a9f")}
            className="group flex items-center gap-2 transition-colors duration-300 hover:-translate-y-0.5"
          >
            <p className="truncate font-serif text-xl font-semibold tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-emerald-700">
              {brandName}
            </p>
            <span className="rounded-full border border-black/10 bg-white/80 px-2.5 py-0.5 text-[11px] font-medium tracking-[0.18em] text-slate-500 uppercase transition-colors duration-300 group-hover:border-emerald-200 group-hover:text-emerald-700">
              {brandVersion}
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              {content.nav.map((item) => (
                <Link
                  key={item.path}
                  href={localizedPath(locale, item.path)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-emerald-50 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href={localizedPath(alternateLocale, "/")}
              className="rounded-md border border-black/10 bg-white/80 px-3 py-2 text-sm font-medium text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              {content.switcher.label}
            </Link>
          </div>
        </div>
      </header>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1040px] flex-col px-3 pb-10 pt-[5.5rem] sm:px-5 sm:pt-[6rem] lg:px-6 lg:pt-[6.25rem]">
        <main className="flex-1">{children}</main>

        <footer className="mt-12 border-t border-black/10 py-6 text-slate-600">
          <SiteFooterActions label={content.site.shortName} />
        </footer>
      </div>
    </div>
  );
}
