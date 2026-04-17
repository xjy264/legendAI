import { AboutPageContent } from "@/components/site-pages";

export const dynamic = "force-dynamic";

export default function Page() {
  return AboutPageContent({ locale: "zh" });
}
