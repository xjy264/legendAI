import { ArticlesPageContent } from "@/components/site-pages";

export const dynamic = "force-dynamic";

export default function Page() {
  return ArticlesPageContent({ locale: "zh" });
}
