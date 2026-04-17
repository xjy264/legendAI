import Link from "next/link";
import { headers } from "next/headers";

import { Locale, localizedPath } from "@/lib/i18n";
import { adminSessionCookieName, getCookieValue, isAdminSessionValue } from "@/lib/auth";
import { getAdminPostBySlug, listAllPosts } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { buildAdminPostList } from "@/lib/admin-posts";
import { getSiteContent } from "@/lib/site-content";
import { AdminEditorCard } from "@/components/admin-editor-card";
import { AdminDeleteButton } from "@/components/admin-delete-button";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSingleParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : "";
}

function getPageParam(params: Record<string, string | string[] | undefined>, key: string) {
  const raw = getSingleParam(params, key);
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildAdminHref(
  locale: Locale,
  values: {
    slug?: string;
    q?: string;
    page?: number;
  },
) {
  const search = new URLSearchParams();

  if (values.slug) {
    search.set("slug", values.slug);
  }

  if (values.q) {
    search.set("q", values.q);
  }

  if (values.page && values.page > 1) {
    search.set("page", String(values.page));
  }

  const path = localizedPath(locale, "/studio/xjy-7a9f");
  const query = search.toString();
  return query ? `${path}?${query}` : path;
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
  const query = getSingleParam(params, "q").trim();
  const selectedSlug = getSingleParam(params, "slug");
  const requestedPage = getPageParam(params, "page");
  const filteredPosts = buildAdminPostList(posts, { query, page: requestedPage, pageSize: 5 });
  const selected = selectedSlug ? await getAdminPostBySlug(selectedSlug) : null;
  const editorMarkdown = selected?.markdown ?? content.admin.placeholder;
  const savedSlug = getSingleParam(params, "saved");
  const deletedFlag = getSingleParam(params, "deleted");
  const isZh = locale === "zh";
  const managementLabel = isZh ? "管理后台" : "Admin dashboard";
  const createLabel = isZh ? "新建文章" : "New post";
  const searchLabel = isZh ? "搜索文章名" : "Search titles";
  const recentLabel = isZh ? "最近文章" : "Recent posts";
  const emptyLabel = isZh ? "没有找到匹配的文章。" : "No matching posts found.";
  const pageLabel = isZh ? "页" : "page";
  const prevLabel = isZh ? "上一页" : "Previous";
  const nextLabel = isZh ? "下一页" : "Next";
  const totalLabel = isZh ? "篇" : "posts";

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_1px_minmax(0,1.1fr)] xl:items-stretch">
      <aside className="grid gap-3 xl:pr-8">
        {savedSlug ? (
          <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            {isZh ? "已保存：" : "Saved: "}
            {savedSlug}
          </div>
        ) : null}
        {deletedFlag ? (
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
            {isZh ? "已删除并从前台隐藏。" : "Deleted and hidden from the public site."}
          </div>
        ) : null}

        <div className="grid gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.24em] text-emerald-700 uppercase">
                {managementLabel}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                {content.admin.title}
              </h1>
              <p className="text-sm leading-7 text-slate-600">{content.admin.description}</p>
            </div>

            <Link
              href={buildAdminHref(locale, {
                q: query,
                page: filteredPosts.page,
              })}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {createLabel}
            </Link>
          </div>

          <form
            action={localizedPath(locale, "/studio/xjy-7a9f")}
            method="get"
            className="rounded-[1.25rem] border border-black/10 bg-slate-50 px-3 py-2.5"
          >
            <input type="hidden" name="slug" value={selectedSlug} />
            <input type="hidden" name="page" value="1" />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                name="q"
                type="text"
                inputMode="search"
                defaultValue={query}
                placeholder={searchLabel}
                autoComplete="off"
                className="h-10 min-w-0 flex-1 appearance-none rounded-2xl border border-black/10 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-300"
              />
              <button className="h-10 shrink-0 whitespace-nowrap rounded-lg border border-black/10 bg-white px-5 text-sm font-medium text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50">
                {isZh ? "搜索" : "Search"}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <p className="font-medium text-slate-600">{recentLabel}</p>
            <p>
              {filteredPosts.totalCount} {totalLabel} · {filteredPosts.page} {pageLabel} /{" "}
              {filteredPosts.totalPages} {pageLabel}
            </p>
          </div>

          <div className="grid gap-3">
            {filteredPosts.posts.length > 0 ? (
              filteredPosts.posts.map((post) => {
                const href = buildAdminHref(locale, {
                  slug: post.slug,
                  q: query,
                  page: filteredPosts.page,
                });

                return (
                  <article
                    key={post.slug}
                    className="flex h-[10.6rem] flex-col overflow-hidden rounded-[1.5rem] border border-black/5 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex shrink-0 items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <p className="truncate font-medium text-slate-950">{post.title}</p>
                          {post.featured ? (
                            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                              {content.common.featured}
                            </span>
                          ) : null}
                        </div>
                        <p className="truncate text-xs text-slate-500">
                          {post.slug} · {formatDate(post.publishedAt, locale)}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs text-slate-600">
                        {post.status}
                      </span>
                    </div>
                    <p
                      className="mt-2 flex-1 text-sm leading-6 text-slate-600"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                      }}
                      title={post.description}
                    >
                      {post.description}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                      <Link
                        href={href}
                        className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                      >
                        {isZh ? "编辑" : "Edit"}
                      </Link>
                      <AdminDeleteButton
                        slug={post.slug}
                        query={query}
                        page={filteredPosts.page}
                        label={isZh ? "删除" : "Delete"}
                        confirmLabel={isZh ? "确认删除" : "Delete"}
                        cancelLabel={isZh ? "取消" : "Cancel"}
                        promptLabel={isZh ? "确认删除这篇文章？" : "Delete this post?"}
                      />
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-[1.5rem] border border-black/10 bg-white/70 px-4 py-6 text-sm text-slate-600">
                {emptyLabel}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-black/10 pt-4">
            {filteredPosts.page > 1 ? (
              <Link
                href={buildAdminHref(locale, {
                  slug: selectedSlug || undefined,
                  q: query,
                  page: filteredPosts.page - 1,
                })}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                {prevLabel}
              </Link>
            ) : (
              <span className="rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-medium text-slate-300">
                {prevLabel}
              </span>
            )}

            <p className="text-sm text-slate-500">
              {filteredPosts.page} / {filteredPosts.totalPages}
            </p>

            {filteredPosts.page < filteredPosts.totalPages ? (
              <Link
                href={buildAdminHref(locale, {
                  slug: selectedSlug || undefined,
                  q: query,
                  page: filteredPosts.page + 1,
                })}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                {nextLabel}
              </Link>
            ) : (
              <span className="rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-medium text-slate-300">
                {nextLabel}
              </span>
            )}
          </div>
        </div>
      </aside>

      <div className="hidden w-px self-stretch bg-black/10 xl:block" aria-hidden="true" />

      <div className="min-h-0 xl:pl-8">
      <AdminEditorCard
        key={selectedSlug || "new"}
        locale={locale}
        initialMarkdown={editorMarkdown}
        selectedSlug={selectedSlug}
        selectedTitle={selected?.title ?? (isZh ? "新建文章" : "New post")}
        query={query}
        page={filteredPosts.page}
      />
      </div>
    </div>
  );
}
