import { ArticlePageContent } from "@/components/site-pages";
import { generateMetadata } from "../../../articles/[slug]/page";

export { generateMetadata };

export default function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  return ArticlePageContent({ ...props, locale: "en" });
}
