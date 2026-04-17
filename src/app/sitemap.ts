import type { MetadataRoute } from "next";

import { listPublishedPosts } from "@/lib/content";
import { localizedPath } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:7785";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPublishedPosts();

  const routes = [
    "",
    "/articles",
    "/projects",
    "/tools",
    "/guestbook",
    "/about",
    "/release-notes",
  ];

  const staticRoutes = [
    ...routes.map((route) => ({
      url: `${siteUrl}${localizedPath("zh", route)}`,
      lastModified: new Date(),
    })),
    ...routes.map((route) => ({
      url: `${siteUrl}${localizedPath("en", route)}`,
      lastModified: new Date(),
    })),
  ];

  const articleRoutes = posts.map((post) => ({
    url: `${siteUrl}/articles/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  const englishArticleRoutes = posts.map((post) => ({
    url: `${siteUrl}/en/articles/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [...staticRoutes, ...articleRoutes, ...englishArticleRoutes];
}
