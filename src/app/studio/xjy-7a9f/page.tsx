import { AdminConsole } from "@/components/admin-console";

export const dynamic = "force-dynamic";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return AdminConsole({ searchParams, locale: "zh" });
}
