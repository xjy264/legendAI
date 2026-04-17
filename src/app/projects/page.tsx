import { ProjectsPageContent } from "@/components/site-pages";

export const dynamic = "force-dynamic";

export default function Page() {
  return ProjectsPageContent({ locale: "zh" });
}
