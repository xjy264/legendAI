import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getAdminReturnPath, isAdminRequestAuthorized } from "@/lib/auth";
import { saveMarkdownPost } from "@/lib/content";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const markdownText = String(formData.get("markdown") ?? "");
  const markdownFile = formData.get("markdownFile");
  const originalSlug = String(formData.get("originalSlug") ?? "");
  const adminPath = getAdminReturnPath(request);

  if (!isAdminRequestAuthorized(request.headers.get("cookie"), password)) {
    return NextResponse.redirect(new URL(`${adminPath}?error=bad-password`, request.url), 303);
  }

  let markdown = markdownText.trim();
  let sourceName: string | undefined;

  if (markdownFile instanceof File && markdownFile.size > 0) {
    markdown = await markdownFile.text();
    sourceName = markdownFile.name;
  }

  if (!markdown.trim()) {
    return NextResponse.redirect(new URL(`${adminPath}?error=missing-markdown`, request.url), 303);
  }

  try {
    const post = await saveMarkdownPost(markdown, sourceName, originalSlug || undefined);
    revalidatePath("/");
    revalidatePath("/en");
    revalidatePath("/articles");
    revalidatePath("/en/articles");
    revalidatePath(`/articles/${post.slug}`);
    revalidatePath(`/en/articles/${post.slug}`);
    if (originalSlug && originalSlug !== post.slug) {
      revalidatePath(`/articles/${originalSlug}`);
      revalidatePath(`/en/articles/${originalSlug}`);
    }
    revalidatePath("/studio/xjy-7a9f");
    revalidatePath("/en/studio/xjy-7a9f");
    return NextResponse.redirect(new URL(`${adminPath}?saved=${post.slug}&slug=${post.slug}`, request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown-error";
    return NextResponse.redirect(
      new URL(`${adminPath}?error=${encodeURIComponent(message)}`, request.url),
      303,
    );
  }
}
