import type { Metadata } from "next";

import { FrontmatterToolPageContent } from "@/components/tool-pages";
import { getToolPageCopy } from "@/lib/tool-page-copy";

export const dynamic = "force-dynamic";

const copy = getToolPageCopy("en");

export const metadata: Metadata = {
  title: copy.frontmatter.title,
  description: copy.frontmatter.description,
};

export default function Page() {
  return (
    <FrontmatterToolPageContent
      locale="en"
      title={copy.frontmatter.title}
      description={copy.frontmatter.description}
    />
  );
}
