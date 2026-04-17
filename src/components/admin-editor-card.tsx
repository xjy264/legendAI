"use client";

import Image from "next/image";
import { useEffect, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";

import matter from "gray-matter";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

type Locale = "zh" | "en";

type MarkdownCodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
  children?: ReactNode;
};

type MarkdownImageProps = ComponentPropsWithoutRef<"img">;

const previewComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-10 text-4xl font-semibold tracking-tight text-slate-950">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 text-2xl font-semibold tracking-tight text-slate-950">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-950">{children}</h3>
  ),
  p: ({ children }) => <p className="mt-5 leading-8 text-slate-700">{children}</p>,
  ul: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 text-slate-700">{children}</ul>,
  ol: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-slate-700">{children}</ol>,
  li: ({ children }) => <li className="leading-7">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-4 border-emerald-400 bg-emerald-50/70 px-5 py-3 text-slate-700">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="font-medium text-emerald-800 underline decoration-emerald-300 underline-offset-4"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }: MarkdownImageProps) =>
    typeof src === "string" ? (
      <Image
        src={src}
        alt={alt ?? ""}
        width={1200}
        height={675}
        className="my-8 block h-auto w-full rounded-[1.75rem] border border-black/10 bg-white object-cover shadow-[0_18px_60px_rgba(15,23,42,0.12)]"
      />
    ) : null,
  code: ({ inline, children }: MarkdownCodeProps) =>
    inline ? (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-900">
        {children}
      </code>
    ) : (
      <code className="block overflow-x-auto rounded-2xl bg-slate-950 px-4 py-4 font-mono text-sm text-slate-100">
        {children}
      </code>
    ),
  pre: ({ children }) => <pre className="mt-6">{children}</pre>,
  hr: () => <hr className="my-10 border-black/10" />,
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-black/10 bg-white/70">
      <table className="w-full border-collapse text-left text-sm text-slate-700">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-black/10 bg-slate-50 px-4 py-3">{children}</th>,
  td: ({ children }) => <td className="border-b border-black/5 px-4 py-3">{children}</td>,
};

function PreviewMarkdown({ content }: { content: string }) {
  return (
    <article className="rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
        components={previewComponents}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

export function AdminEditorCard({
  locale,
  initialMarkdown,
  selectedSlug,
  selectedTitle,
  query,
  page,
}: {
  locale: Locale;
  initialMarkdown: string;
  selectedSlug: string;
  selectedTitle: string;
  query: string;
  page: number;
}) {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewContent = matter(markdown).content.trim();
  const isZh = locale === "zh";
  const previewLabel = isZh ? "预览" : "Preview";
  const closeLabel = isZh ? "关闭预览" : "Close preview";
  const editorLabel = isZh ? "Markdown 编辑器" : "Markdown editor";
  const contentLabel = isZh ? "Markdown 内容" : "Markdown content";
  const newLabel = isZh ? "新建文章" : "New post";
  const emptyLabel = isZh ? "没有正文内容。" : "No article body found.";
  const saveLabel = selectedSlug ? (isZh ? "保存修改" : "Save changes") : (isZh ? "发布文章" : "Publish post");

  useEffect(() => {
    setMarkdown(initialMarkdown);
  }, [initialMarkdown]);

  useEffect(() => {
    if (!previewOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewOpen]);

  return (
    <>
      <div className="flex h-full min-h-0 flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.24em] text-emerald-700 uppercase">
              {editorLabel}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              {selectedTitle || newLabel}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50"
          >
            {previewLabel}
          </button>
        </div>

        <form
          action="/api/admin/posts"
          method="post"
          encType="multipart/form-data"
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <input type="hidden" name="originalSlug" value={selectedSlug} />
          <input type="hidden" name="q" value={query} />
          <input type="hidden" name="page" value={page} />

          <label className="flex min-h-0 flex-1 flex-col gap-2 text-sm text-slate-600">
            {contentLabel}
            <textarea
              name="markdown"
              rows={22}
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              className="min-h-0 flex-1 rounded-[2rem] border border-black/10 bg-white px-4 py-3 font-mono text-sm leading-7 text-slate-950 outline-none transition focus:border-emerald-300"
            />
          </label>

          <button className="justify-self-start rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
            {saveLabel}
          </button>
        </form>
      </div>

      {previewOpen ? (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={previewLabel}
          onClick={() => setPreviewOpen(false)}
        >
          <div className="mx-auto flex min-h-full max-w-4xl items-start justify-center">
            <div
              className="flex max-h-[calc(100vh-4rem)] w-full flex-col gap-4 overflow-hidden rounded-[2rem] border border-black/10 bg-white p-4 shadow-[0_30px_100px_rgba(15,23,42,0.28)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="shrink-0 flex items-center justify-between gap-3 px-2 pt-1">
                <div>
                  <p className="text-xs font-semibold tracking-[0.24em] text-emerald-700 uppercase">
                    {previewLabel}
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                    {selectedTitle || newLabel}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-800"
                >
                  {closeLabel}
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto rounded-[1.5rem] bg-slate-50/80 p-2 overscroll-contain">
                {previewContent ? (
                  <PreviewMarkdown content={previewContent} />
                ) : (
                  <div className="rounded-[2rem] border border-black/10 bg-white/70 p-6 text-sm text-slate-600">
                    {emptyLabel}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
