import type { Metadata } from "next";

import { TimeToolPageContent } from "@/components/tool-pages";
import { getToolPageCopy } from "@/lib/tool-page-copy";

export const dynamic = "force-dynamic";

const copy = getToolPageCopy("zh");

export const metadata: Metadata = {
  title: copy.time.title,
  description: copy.time.description,
};

export default function Page() {
  return <TimeToolPageContent locale="zh" title={copy.time.title} description={copy.time.description} />;
}
