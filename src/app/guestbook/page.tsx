import { GuestbookPageContent } from "@/components/site-pages";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return GuestbookPageContent({ searchParams, locale: "zh" });
}
