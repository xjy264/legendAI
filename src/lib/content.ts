import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  estimateReadingMinutes,
  excerptFromMarkdown,
  slugify,
  toTagList,
} from "@/lib/utils";

const postsDir = path.join(/* turbopackIgnore: true */ process.cwd(), "content", "posts");

function normalizePublishedAt(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value;
}

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  category: z.string().optional().default("essay"),
  status: z.enum(["draft", "published"]).optional().default("published"),
  featured: z.boolean().optional().default(false),
  cover: z.string().optional(),
  publishedAt: z.preprocess(normalizePublishedAt, z.string().optional()),
  slug: z.string().optional(),
});

export type PostDetail = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  featured: boolean;
  cover: string | null;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  readingMinutes: number;
  contentPath: string;
  content: string;
};

export type AdminPostDetail = Omit<PostDetail, "content"> & {
  markdown: string;
};

async function ensurePostsDir() {
  await fs.mkdir(postsDir, { recursive: true });
}

function rowToPost(row: {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  status: string;
  featured: boolean;
  cover: string | null;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  readingMinutes: number;
  contentPath: string;
}) {
  return {
    ...row,
    tags: safeJsonArray(row.tags),
    status: row.status as "draft" | "published",
  };
}

function safeJsonArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function buildMarkdownFromRecord(row: {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  status: string;
  featured: boolean;
  cover: string | null;
  publishedAt: Date;
  contentPath: string;
}) {
  return matter.stringify("", {
    slug: row.slug,
    title: row.title,
    description: row.description,
    tags: safeJsonArray(row.tags),
    category: row.category,
    status: row.status,
    featured: row.featured,
    cover: row.cover ?? undefined,
    publishedAt: row.publishedAt.toISOString().slice(0, 10),
  }) + "\n";
}

async function parseMarkdownFile(filePath: string) {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  const data = frontmatterSchema.parse(parsed.data);
  const slug = slugify(data.slug ?? data.title);
  const tags = toTagList(data.tags);
  const content = parsed.content.trim();
  const publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();
  const excerpt = data.description || excerptFromMarkdown(content);

  return {
    slug,
    title: data.title,
    description: data.description || excerpt,
    category: data.category,
    tags,
    status: data.status,
    featured: data.featured,
    cover: data.cover ?? null,
    publishedAt,
    readingMinutes: estimateReadingMinutes(content),
    content,
    excerpt,
  };
}

async function upsertPostFromFile(fileName: string) {
  const filePath = path.join(postsDir, fileName);
  const post = await parseMarkdownFile(filePath);
  const contentPath = path.relative(process.cwd(), filePath);

  const record = await prisma.post.upsert({
    where: { slug: post.slug },
    create: {
      slug: post.slug,
      title: post.title,
      description: post.description,
      contentPath,
      category: post.category,
      tags: JSON.stringify(post.tags),
      status: post.status,
      featured: post.featured,
      cover: post.cover,
      publishedAt: post.publishedAt,
      readingMinutes: post.readingMinutes,
    },
    update: {
      title: post.title,
      description: post.description,
      contentPath,
      category: post.category,
      tags: JSON.stringify(post.tags),
      status: post.status,
      featured: post.featured,
      cover: post.cover,
      publishedAt: post.publishedAt,
      readingMinutes: post.readingMinutes,
    },
  });

  return {
    ...rowToPost(record),
    content: post.content,
  };
}

export async function syncMarkdownPosts() {
  await ensurePostsDir();

  const files = await fs.readdir(postsDir);
  const markdownFiles = files.filter((file) => file.endsWith(".md"));

  const records = [];
  for (const fileName of markdownFiles) {
    records.push(await upsertPostFromFile(fileName));
  }

  return records;
}

export async function listPublishedPosts() {
  await syncMarkdownPosts();
  const rows = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: [{ updatedAt: "desc" }, { publishedAt: "desc" }],
  });

  return rows.map(rowToPost);
}

export async function listAllPosts() {
  await syncMarkdownPosts();
  const rows = await prisma.post.findMany({
    orderBy: [{ updatedAt: "desc" }, { publishedAt: "desc" }],
  });

  return rows.map(rowToPost);
}

export async function listRecentPosts(limit = 3) {
  const posts = await listPublishedPosts();
  return posts.slice(0, limit);
}

export async function listFeaturedPosts(limit = 3) {
  const posts = await listPublishedPosts();
  return posts.filter((post) => post.featured).slice(0, limit);
}

export async function getPostBySlug(slug: string) {
  await syncMarkdownPosts();
  const row = await prisma.post.findUnique({
    where: { slug },
  });

  if (!row || row.status !== "published") {
    return null;
  }

  const filePath = path.join(/* turbopackIgnore: true */ process.cwd(), row.contentPath);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);

  return {
    ...rowToPost(row),
    content: parsed.content.trim(),
  };
}

export async function getAdminPostBySlug(slug: string) {
  await syncMarkdownPosts();
  const row = await prisma.post.findUnique({
    where: { slug },
  });

  if (!row) {
    return null;
  }

  const filePath = path.join(/* turbopackIgnore: true */ process.cwd(), row.contentPath);

  try {
    const markdown = await fs.readFile(filePath, "utf8");
    return {
      ...rowToPost(row),
      markdown,
    } satisfies AdminPostDetail;
  } catch {
    return {
      ...rowToPost(row),
      markdown: buildMarkdownFromRecord(row),
    } satisfies AdminPostDetail;
  }
}

export async function getPostSummaries() {
  const posts = await listPublishedPosts();
  return posts.map((post) => ({
    ...post,
    excerpt: post.description,
  }));
}

export async function saveMarkdownPost(
  markdown: string,
  sourceName?: string,
  originalSlug?: string,
) {
  await ensurePostsDir();
  const parsed = matter(markdown);
  const data = frontmatterSchema.parse(parsed.data);
  const slug = slugify(data.slug ?? data.title ?? sourceName ?? "post");
  const filePath = path.join(postsDir, `${slug}.md`);
  const normalized = markdown.trimEnd() + "\n";

  if (originalSlug && originalSlug !== slug) {
    const previousRow = await prisma.post.findUnique({ where: { slug: originalSlug } });
    const previousPath = previousRow?.contentPath
      ? path.join(/* turbopackIgnore: true */ process.cwd(), previousRow.contentPath)
      : path.join(postsDir, `${originalSlug}.md`);
    await Promise.allSettled([
      fs.rm(previousPath, { force: true }),
      prisma.post.deleteMany({ where: { slug: originalSlug } }),
    ]);
  }

  await fs.writeFile(filePath, normalized, "utf8");

  const content = parsed.content.trim();
  const tags = toTagList(data.tags);
  const publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();
  const contentPath = path.relative(process.cwd(), filePath);
  const readingMinutes = estimateReadingMinutes(content);

  const record = await prisma.post.upsert({
    where: { slug },
    create: {
      slug,
      title: data.title,
      description: data.description,
      contentPath,
      category: data.category,
      tags: JSON.stringify(tags),
      status: data.status,
      featured: data.featured,
      cover: data.cover ?? null,
      publishedAt,
      readingMinutes,
    },
    update: {
      title: data.title,
      description: data.description,
      contentPath,
      category: data.category,
      tags: JSON.stringify(tags),
      status: data.status,
      featured: data.featured,
      cover: data.cover ?? null,
      publishedAt,
      readingMinutes,
    },
  });

  return {
    ...rowToPost(record),
    content,
  };
}

export async function deleteMarkdownPost(slug: string) {
  await ensurePostsDir();
  const row = await prisma.post.findUnique({ where: { slug } });

  if (!row) {
    return false;
  }

  const filePath = path.join(/* turbopackIgnore: true */ process.cwd(), row.contentPath);

  await Promise.allSettled([
    fs.rm(filePath, { force: true }),
    prisma.post.deleteMany({ where: { slug } }),
  ]);

  return true;
}
