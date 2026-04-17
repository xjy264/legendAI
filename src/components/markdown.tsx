import ReactMarkdown, { type Components } from "react-markdown";
import Image from "next/image";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type MarkdownCodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
  children?: ReactNode;
};

type MarkdownImageProps = ComponentPropsWithoutRef<"img">;

const components: Components = {
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

export function MarkdownContent({ content }: { content: string }) {
  return (
    <article className="rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
