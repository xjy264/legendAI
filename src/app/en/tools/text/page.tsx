import type { Metadata } from "next";

import { TextToolPageContent } from "@/components/tool-pages";
import { getToolPageCopy } from "@/lib/tool-page-copy";

export const dynamic = "force-dynamic";

const copy = getToolPageCopy("en");

export const metadata: Metadata = {
  title: copy.text.title,
  description: copy.text.description,
};

export default function Page() {
  return <TextToolPageContent locale="en" title={copy.text.title} description={copy.text.description} />;
}
