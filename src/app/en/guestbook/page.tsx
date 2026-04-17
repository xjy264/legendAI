import { GuestbookPageContent } from "@/components/site-pages";

export default function Page(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return GuestbookPageContent({ ...props, locale: "en" });
}
