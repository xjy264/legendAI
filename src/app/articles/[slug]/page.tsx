import type { Metadata } from "next";

import { ArticlePageContent } from "@/components/site-pages";
import { getPostBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article not found",
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default function Page(props: PageProps) {
  return ArticlePageContent({ ...props, locale: "zh" });
}
