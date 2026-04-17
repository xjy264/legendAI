import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import { SiteShell } from "@/components/site-shell";
import { getLocaleFromHeader } from "@/lib/i18n";
import { getSiteContent } from "@/lib/site-content";

import "./globals.css";

const sans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const locale = getLocaleFromHeader(headerStore.get("x-locale"));
  const content = getSiteContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: content.site.name,
      template: `%s | ${content.site.name}`,
    },
    description: content.site.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const locale = getLocaleFromHeader(headerStore.get("x-locale"));
  const content = getSiteContent(locale);

  return (
    <html lang={locale === "en" ? "en" : "zh-CN"} className={`${sans.variable} ${mono.variable} ${serif.variable} h-full`}>
      <body className="min-h-screen bg-[#f4efe6] text-slate-900 antialiased">
        <SiteShell locale={locale} content={content}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
