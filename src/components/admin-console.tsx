import Link from "next/link";
import { headers } from "next/headers";

import matter from "gray-matter";

import { MarkdownContent } from "@/components/markdown";
import { Locale, localizedPath } from "@/lib/i18n";
import { adminSessionCookieName, getCookieValue, isAdminSessionValue } from "@/lib/auth";
import { getAdminPostBySlug, listAllPosts } from "@/lib/content";
import { getSiteContent } from "@/lib/site-content";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSingleParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return typeof value === "string" ? value : "";
}

export async function AdminConsole({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: SearchParams;
}) {
  const content = getSiteContent(locale);
  const headerStore = await headers();
  const cookieValue = getCookieValue(headerStore.get("cookie"), adminSessionCookieName);
  const unlocked = isAdminSessionValue(cookieValue);
  const params = await searchParams;

  if (!unlocked) {
    return (
      <div className="mx-auto grid max-w-xl gap-6 rounded-[2rem] border border-black/10 bg-white/75 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.24em] text-emerald-700 uppercase">
            {content.admin.kicker}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {content.admin.title}
          </h1>
          <p className="text-sm leading-7 text-slate-600">{content.admin.description}</p>
        </div>

        {getSingleParam(params, "error") ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {content.common.invalidPassword}
          </div>
        ) : null}

        <form action="/api/admin/session" method="post" className="grid gap-4">
          <label className="grid gap-2 text-sm text-slate-600">
            {content.admin.password}
            <input
              name="password"
              type="password"
              required
              autoFocus
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
            />
          </label>
          <button className="justify-self-start rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
            {content.common.submit}
          </button>
        </form>
      </div>
    );
  }

  const posts = await listAllPosts();
  const selectedSlug = getSingleParam(params, "slug");
  const selected = selectedSlug ? await getAdminPostBySlug(selectedSlug) : null;
  const editorMarkdown = selected?.markdown ?? content.admin.placeholder;
  const editorPreview = matter(editorMarkdown).content.trim();
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;
  const featuredCount = posts.filter((post) => post.featured).length;
  const savedSlug = getSingleParam(params, "saved");
  const deletedFlag = getSingleParam(params, "deleted");

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
      <aside className="grid gap-4">
        {savedSlug ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            已保存：{savedSlug}
          </div>
        ) : null}
        {deletedFlag ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
            已删除并从前台隐藏。
          </div>
        ) : null}

        <section className="rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <p className="text-xs font-semibold tracking-[0.24em] text-emerald-700 uppercase">
            {content.admin.kicker}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {content.admin.title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{content.admin.description}</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-black/10 bg-white p-3">
              <p className="text-xs text-slate-500">All</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{posts.length}</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-3">
              <p className="text-xs text-slate-500">Published</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{publishedCount}</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-3">
              <p className="text-xs text-slate-500">Drafts</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{draftCount}</p>
            </div>
          </div>
          <div className="mt-3 rounded-2xl border border-black/10 bg-slate-950 px-4 py-3 text-sm text-slate-100">
            Featured: {featuredCount}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={localizedPath(locale, "/studio/xjy-7a9f")}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              新建文章
            </Link>
            {selectedSlug ? (
              <Link
                href={localizedPath(locale, `/studio/xjy-7a9f?slug=${encodeURIComponent(selectedSlug)}`)}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                当前文章
              </Link>
            ) : null}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">{content.admin.recentPosts}</h2>
            <span className="text-xs text-slate-500">All content</span>
          </div>
          <div className="mt-4 grid gap-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-950">{post.title}</p>
                    <p className="text-xs text-slate-500">{post.slug}</p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-600">
                    {post.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{post.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={localizedPath(locale, `/studio/xjy-7a9f?slug=${encodeURIComponent(post.slug)}`)}
                    className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                  >
                    编辑
                  </Link>
                  <form action={`/api/admin/posts/${encodeURIComponent(post.slug)}`} method="post">
                    <button className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100">
                      删除
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
      </aside>

      <section className="grid gap-6">
        <form
          action="/api/admin/posts"
          method="post"
          encType="multipart/form-data"
          className="grid gap-4 rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
        >
          <input type="hidden" name="originalSlug" value={selectedSlug} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              Markdown 文件
              <input
                name="markdownFile"
                type="file"
                accept=".md,.markdown,text/markdown"
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-white"
              />
            </label>
            <div className="rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {selected ? `正在编辑：${selected.title}` : "新建一篇文章"}
            </div>
          </div>

          <label className="grid gap-2 text-sm text-slate-600">
            Markdown 内容
            <textarea
              name="markdown"
              rows={22}
              defaultValue={editorMarkdown}
              className="min-h-[520px] rounded-3xl border border-black/10 bg-white px-4 py-3 font-mono text-sm leading-7 text-slate-950 outline-none transition focus:border-emerald-300"
            />
          </label>

          <button className="justify-self-start rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
            {selected ? "保存修改" : content.admin.submit}
          </button>
        </form>

        <div className="grid gap-4 rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Preview</h2>
            <span className="text-xs text-slate-500">Frontmatter omitted</span>
          </div>
          {editorPreview ? (
            <MarkdownContent content={editorPreview} />
          ) : (
            <div className="rounded-3xl border border-black/10 bg-white/70 p-6 text-sm text-slate-600">
              没有正文内容。
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
