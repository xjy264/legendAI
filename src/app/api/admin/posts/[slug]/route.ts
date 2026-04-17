import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getAdminReturnPath, isAdminRequestAuthorized } from "@/lib/auth";
import { deleteMarkdownPost } from "@/lib/content";

export const runtime = "nodejs";

function revalidatePostPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/articles");
  revalidatePath("/en/articles");
  revalidatePath(`/articles/${slug}`);
  revalidatePath(`/en/articles/${slug}`);
  revalidatePath("/studio/xjy-7a9f");
  revalidatePath("/en/studio/xjy-7a9f");
}

async function deletePost(
  request: Request,
  slug: string,
  password: string,
  query: string,
  page: string,
) {
  const adminPath = getAdminReturnPath(request);

  function redirectParams(extra: Record<string, string>) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(extra)) {
      if (value) {
        params.set(key, value);
      }
    }

    if (query) {
      params.set("q", query);
    }

    if (page && page !== "1") {
      params.set("page", page);
    }

    return params.toString();
  }

  if (!isAdminRequestAuthorized(request.headers.get("cookie"), password)) {
    return NextResponse.redirect(
      new URL(`${adminPath}?${redirectParams({ error: "bad-password" })}`, request.url),
      303,
    );
  }

  await deleteMarkdownPost(slug);
  revalidatePostPaths(slug);

  return NextResponse.redirect(
    new URL(`${adminPath}?${redirectParams({ deleted: "1" })}`, request.url),
    303,
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const query = String(formData.get("q") ?? "").trim();
  const page = String(formData.get("page") ?? "").trim();
  const { slug } = await params;

  return deletePost(request, slug, password, query, page);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!isAdminRequestAuthorized(request.headers.get("cookie"), "")) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const deleted = await deleteMarkdownPost(slug);
  revalidatePostPaths(slug);

  return NextResponse.json({ ok: deleted });
}
