import Link from "next/link";

import { formatDate } from "@/lib/utils";

export function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <p className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      {note ? <p className="mt-2 text-sm text-slate-600">{note}</p> : null}
    </div>
  );
}

export function PostCard({
  href,
  title,
  description,
  publishedAt,
  displayAt,
  category,
  tags,
  featured,
  featuredLabel = "Featured",
  locale = "zh",
}: {
  href: string;
  title: string;
  description: string;
  publishedAt: Date;
  displayAt?: Date;
  category: string;
  tags: string[];
  featured?: boolean;
  featuredLabel?: string;
  locale?: "zh" | "en";
}) {
  return (
    <Link
      href={href}
      className="group block rounded-3xl border border-black/10 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase">
            {category}
          </p>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-950 transition group-hover:text-emerald-800">
            {title}
          </h3>
        </div>
        {featured ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
            {featuredLabel}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>{formatDate(displayAt ?? publishedAt, locale)}</span>
        <span>·</span>
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function ProjectCard({
  title,
  description,
  stack,
  status,
  updatedAt,
  updatedLabel = "Updated",
  locale = "zh",
}: {
  title: string;
  description: string;
  stack: string[];
  status: string;
  updatedAt?: string;
  updatedLabel?: string;
  locale?: "zh" | "en";
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-gradient-to-br from-white/90 to-white/60 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
        <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-slate-600">
          {status}
        </span>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
      {updatedAt ? (
        <p className="mt-4 text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
          {updatedLabel} · {formatDate(updatedAt, locale)}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {stack.map((item) => (
          <span key={item} className="rounded-full bg-slate-950 px-3 py-1 text-xs text-white">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ToolCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-black/10 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-amber-200"
    >
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </Link>
  );
}
