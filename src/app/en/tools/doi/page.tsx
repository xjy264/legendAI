import type { Metadata } from "next";

import { DoiToolPageContent } from "@/components/tool-pages";
import { getToolPageCopy } from "@/lib/tool-page-copy";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const copy = getToolPageCopy("en");
const content = getSiteContent("en");

export const metadata: Metadata = {
  title: copy.doi.title,
  description: copy.doi.description,
};

export default function Page() {
  return (
    <DoiToolPageContent
      locale="en"
      title={copy.doi.title}
      description={copy.doi.description}
      copy={{
        kicker: content.toolsPage.citationTitle,
        doiLabel: content.toolsPage.doiLabel,
        lookupButton: content.toolsPage.lookupButton,
        loading: content.toolsPage.loading,
        metadataTitle: content.toolsPage.metadataTitle,
        formatsTitle: content.toolsPage.formatsTitle,
        bibtexLabel: content.toolsPage.bibtexLabel,
        apaLabel: content.toolsPage.apaLabel,
        gbtLabel: content.toolsPage.gbtLabel,
        copyButton: content.toolsPage.copyButton,
        copied: content.toolsPage.copied,
        invalidDoi: content.toolsPage.invalidDoi,
        fetchFailed: content.toolsPage.fetchFailed,
      }}
    />
  );
}
