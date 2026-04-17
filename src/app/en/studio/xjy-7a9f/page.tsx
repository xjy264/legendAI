import { AdminConsole } from "@/components/admin-console";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return AdminConsole({ searchParams, locale: "en" });
}
