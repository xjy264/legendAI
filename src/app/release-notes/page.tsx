import { ReleaseNotesPageContent } from "@/components/site-pages";

export const dynamic = "force-dynamic";

export default function Page() {
  return ReleaseNotesPageContent({ locale: "zh" });
}
