import { HomePageContent } from "@/components/site-pages";

export const dynamic = "force-dynamic";

export default async function Page() {
  return HomePageContent({ locale: "zh" });
}
