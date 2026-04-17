import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getAdminReturnPath, isAdminRequestAuthorized } from "@/lib/auth";
import { deleteMarkdownPost } from "@/lib/content";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const { slug } = await params;
  const adminPath = getAdminReturnPath(request);

  if (!isAdminRequestAuthorized(request.headers.get("cookie"), password)) {
    return NextResponse.redirect(new URL(`${adminPath}?error=bad-password`, request.url), 303);
  }

  await deleteMarkdownPost(slug);
  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/articles");
  revalidatePath("/en/articles");
  revalidatePath(`/articles/${slug}`);
  revalidatePath(`/en/articles/${slug}`);
  revalidatePath("/studio/xjy-7a9f");
  revalidatePath("/en/studio/xjy-7a9f");

  return NextResponse.redirect(new URL(`${adminPath}?deleted=1`, request.url), 303);
}
