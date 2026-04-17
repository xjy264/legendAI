"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";

import { SectionHeading } from "@/components/section-heading";
import type { Locale } from "@/lib/i18n";
import {
  isValidDoi,
  normalizeDoi,
} from "@/lib/citation";
import { slugify } from "@/lib/utils";

type CitationRecordView = {
  doi: string;
  title: string;
  authors: Array<{ given?: string; family?: string; name?: string }>;
  journal?: string;
  year?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  url?: string;
};

function ToolShell({
  locale,
  kicker,
  title,
  description,
  children,
}: {
  locale: Locale;
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const toolsPath = locale === "en" ? "/en/tools" : "/tools";

  return (
    <div className="grid gap-6">
      <Link
        href={toolsPath}
        className="text-sm text-slate-500 transition hover:text-slate-950"
      >
        {locale === "en" ? "Back to tools" : "返回工具箱"}
      </Link>
      <SectionHeading kicker={kicker} title={title} description={description} />
      <div className="rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}

function CopyBlock({
  label,
  value,
  buttonLabel,
  copiedLabel,
}: {
  label: string;
  value: string;
  buttonLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="grid gap-3 rounded-3xl border border-black/10 bg-slate-950 p-5 text-slate-100">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{label}</h3>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-slate-100 transition hover:border-white/30"
        >
          {copied ? copiedLabel : buttonLabel}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-slate-200">
        {value}
      </pre>
    </div>
  );
}

function formatAuthorLine(authors: Array<{ given?: string; family?: string; name?: string }>) {
  if (authors.length === 0) {
    return "Anonymous";
  }

  return authors
    .map((author) => [author.family, author.given, author.name].filter(Boolean).join(" ").trim())
    .filter(Boolean)
    .join(", ");
}

export function DoiToolPageContent({
  locale,
  title,
  description,
  copy,
}: {
  locale: Locale;
  title: string;
  description: string;
  copy: {
    kicker: string;
    doiLabel: string;
    lookupButton: string;
    loading: string;
    metadataTitle: string;
    formatsTitle: string;
    bibtexLabel: string;
    apaLabel: string;
    gbtLabel: string;
    copyButton: string;
    copied: string;
    invalidDoi: string;
    fetchFailed: string;
  };
}) {
  const fieldLabels =
    locale === "en"
      ? {
          title: "Title",
          authors: "Authors",
          journal: "Journal",
          year: "Year",
          doi: "DOI",
          url: "URL",
        }
      : {
          title: "标题",
          authors: "作者",
          journal: "期刊",
          year: "年份",
          doi: "DOI",
          url: "链接",
        };

  const [doiInput, setDoiInput] = useState("10.1038/s41586-020-2649-2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [record, setRecord] = useState<CitationRecordView | null>(null);
  const [formats, setFormats] = useState<{ bibtex: string; apa: string; gbt: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const normalized = normalizeDoi(doiInput);
    if (!isValidDoi(normalized)) {
      setLoading(false);
      setError(copy.invalidDoi);
      return;
    }

    try {
      const response = await fetch(`/api/tools/doi?doi=${encodeURIComponent(normalized)}`);
      if (!response.ok) {
        throw new Error("fetch-failed");
      }

      const data = (await response.json()) as {
        record: CitationRecordView;
        bibtex: string;
        apa: string;
        gbt: string;
      };

      setRecord(data.record);
      setFormats({ bibtex: data.bibtex, apa: data.apa, gbt: data.gbt });
    } catch {
      setError(copy.fetchFailed);
      setRecord(null);
      setFormats(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolShell locale={locale} kicker={copy.kicker} title={title} description={description}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-2 text-sm text-slate-600">
          {copy.doiLabel}
          <input
            value={doiInput}
            onChange={(event) => setDoiInput(event.target.value)}
            placeholder="10.xxxx/xxxxx"
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="justify-self-start rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? copy.loading : copy.lookupButton}
        </button>
      </form>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {record && formats ? (
        <div className="mt-6 grid gap-4">
          <div className="rounded-3xl border border-black/10 bg-slate-50 p-5">
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
              {copy.metadataTitle}
            </p>
            <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <div>
                <span className="text-slate-500">{fieldLabels.title}</span>
                <p className="font-medium text-slate-950">{record.title}</p>
              </div>
              <div>
                <span className="text-slate-500">{fieldLabels.authors}</span>
                <p className="font-medium text-slate-950">{formatAuthorLine(record.authors)}</p>
              </div>
              <div>
                <span className="text-slate-500">{fieldLabels.journal}</span>
                <p className="font-medium text-slate-950">{record.journal || "-"}</p>
              </div>
              <div>
                <span className="text-slate-500">{fieldLabels.year}</span>
                <p className="font-medium text-slate-950">{record.year || "-"}</p>
              </div>
              <div>
                <span className="text-slate-500">{fieldLabels.doi}</span>
                <p className="font-medium text-slate-950">{record.doi}</p>
              </div>
              <div>
                <span className="text-slate-500">{fieldLabels.url}</span>
                <p className="font-medium text-slate-950 break-all">{record.url || "-"}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
              {copy.formatsTitle}
            </p>
            <CopyBlock
              label={copy.bibtexLabel}
              value={formats.bibtex}
              buttonLabel={copy.copyButton}
              copiedLabel={copy.copied}
            />
            <CopyBlock
              label={copy.apaLabel}
              value={formats.apa}
              buttonLabel={copy.copyButton}
              copiedLabel={copy.copied}
            />
            <CopyBlock
              label={copy.gbtLabel}
              value={formats.gbt}
              buttonLabel={copy.copyButton}
              copiedLabel={copy.copied}
            />
          </div>
        </div>
      ) : null}
    </ToolShell>
  );
}

function serializeFrontmatter(values: {
  title: string;
  description: string;
  category: string;
  tags: string;
  status: string;
  publishedAt: string;
  featured: boolean;
}) {
  const parsedTags = values.tags
    .split(/[,\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean);

  const lines = [
    "---",
    `title: ${values.title || "Untitled"}`,
    `description: ${values.description || "Add a short summary."}`,
    `category: ${values.category || "notes"}`,
    `status: ${values.status || "draft"}`,
    `featured: ${values.featured ? "true" : "false"}`,
    `publishedAt: ${values.publishedAt || new Date().toISOString().slice(0, 10)}`,
    `tags: [${parsedTags.join(", ")}]`,
    "---",
  ];

  return { frontmatter: lines.join("\n"), valid: parsedTags.length > 0 && Boolean(values.title.trim()) };
}

export function FrontmatterToolPageContent({
  locale,
  title,
  description,
}: {
  locale: Locale;
  title: string;
  description: string;
}) {
  const labels =
    locale === "en"
      ? {
          kicker: "Frontmatter",
          title: "Title",
          description: "Description",
          category: "Category",
          status: "Status",
          tags: "Tags",
          publishedAt: "Published at",
          featured: "Featured post",
          ready: "Frontmatter looks ready.",
          missing: "Fill the required fields to keep the entry valid.",
          generated: "Generated frontmatter",
          copy: "Copy",
          copied: "Copied",
        }
      : {
          kicker: "Frontmatter",
          title: "标题",
          description: "简介",
          category: "分类",
          status: "状态",
          tags: "标签",
          publishedAt: "发布日期",
          featured: "精选文章",
          ready: "Frontmatter 可以用了。",
          missing: "补齐必填项后就会保持有效。",
          generated: "生成的 frontmatter",
          copy: "复制",
          copied: "已复制",
        };

  const [values, setValues] = useState({
    title: "A paper note",
    description: "Why this paper is worth keeping.",
    category: "paper",
    tags: "paper, notes",
    status: "published",
    publishedAt: "2025-09-20",
    featured: true,
  });

  const preview = useMemo(() => serializeFrontmatter(values), [values]);
  const slug = slugify(values.title);

  return (
    <ToolShell
      locale={locale}
      kicker={labels.kicker}
      title={title}
      description={description}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm text-slate-600">
            {labels.title}
            <input
              value={values.title}
              onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            {labels.description}
            <textarea
              value={values.description}
              onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
              rows={4}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              {labels.category}
              <input
                value={values.category}
                onChange={(event) => setValues((current) => ({ ...current, category: event.target.value }))}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              {labels.status}
              <input
                value={values.status}
                onChange={(event) => setValues((current) => ({ ...current, status: event.target.value }))}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              {labels.tags}
              <input
                value={values.tags}
                onChange={(event) => setValues((current) => ({ ...current, tags: event.target.value }))}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              {labels.publishedAt}
              <input
                type="date"
                value={values.publishedAt}
                onChange={(event) => setValues((current) => ({ ...current, publishedAt: event.target.value }))}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
              />
            </label>
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(event) => setValues((current) => ({ ...current, featured: event.target.checked }))}
              className="h-4 w-4 rounded border-black/20"
            />
            {labels.featured}
          </label>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Slug preview: <span className="font-medium text-slate-950">{slug || "-"}</span>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {preview.valid ? labels.ready : labels.missing}
          </div>
        </div>

        <CopyBlock
          label={labels.generated}
          value={preview.frontmatter}
          buttonLabel={labels.copy}
          copiedLabel={labels.copied}
        />
      </div>
    </ToolShell>
  );
}

function formatUnixToLocal(value: string) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "";
  }

  const milliseconds = value.length <= 10 ? numeric * 1000 : numeric;
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatReadableDate(value: string, locale: Locale) {
  const date = new Date(Number(value.length <= 10 ? Number(value) * 1000 : Number(value)));
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

export function TimeToolPageContent({
  locale,
  title,
  description,
}: {
  locale: Locale;
  title: string;
  description: string;
}) {
  const labels =
    locale === "en"
      ? {
          kicker: "Time",
          unix: "Unix timestamp",
          readable: "Readable date",
          result: "Result",
          local: "Local datetime",
          human: "Readable",
          note: "Use the left side to switch either direction.",
        }
      : {
          kicker: "时间",
          unix: "Unix 时间戳",
          readable: "可读时间",
          result: "结果",
          local: "本地时间",
          human: "格式化显示",
          note: "左侧可以双向切换。",
        };

  const [unixInput, setUnixInput] = useState("1713312000");
  const [dateInput, setDateInput] = useState("2025-09-20T12:00");

  const derivedDate = useMemo(() => formatUnixToLocal(unixInput), [unixInput]);
  const derivedUnix = useMemo(() => {
    const date = new Date(dateInput);
    return Number.isNaN(date.getTime()) ? "" : String(Math.floor(date.getTime() / 1000));
  }, [dateInput]);
  const readable = useMemo(() => formatReadableDate(unixInput, locale), [unixInput, locale]);

  return (
    <ToolShell locale={locale} kicker={labels.kicker} title={title} description={description}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm text-slate-600">
            {labels.unix}
            <input
              value={unixInput}
              onChange={(event) => setUnixInput(event.target.value)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            {labels.readable}
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(event) => setDateInput(event.target.value)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
            />
          </label>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-black/10 bg-slate-50 p-5">
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
              {labels.result}
            </p>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <div>
                <span className="text-slate-500">Unix</span>
                <p className="font-medium text-slate-950">{derivedUnix || "-"}</p>
              </div>
              <div>
                <span className="text-slate-500">{labels.local}</span>
                <p className="font-medium text-slate-950">{derivedDate || "-"}</p>
              </div>
              <div>
                <span className="text-slate-500">{labels.human}</span>
                <p className="font-medium text-slate-950">{readable || "-"}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-100">
            {labels.note}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

export function TextToolPageContent({
  locale,
  title,
  description,
}: {
  locale: Locale;
  title: string;
  description: string;
}) {
  const labels =
    locale === "en"
      ? {
          kicker: "Text",
          input: "Text input",
          slug: "Slug",
          titleCase: "Title case",
          trimmed: "Trimmed",
          upper: "Uppercase",
          lower: "Lowercase",
          encode: "URL encode",
          decode: "URL decode",
        }
      : {
          kicker: "文本",
          input: "输入文本",
          slug: "Slug",
          titleCase: "首字母大写",
          trimmed: "清理空白",
          upper: "大写",
          lower: "小写",
          encode: "URL 编码",
          decode: "URL 解码",
        };

  const [value, setValue] = useState("Reading notes for diffusion models");

  const normalized = useMemo(() => value.trim().replace(/\s+/g, " "), [value]);
  const slug = useMemo(() => slugify(value), [value]);
  const titleCase = useMemo(
    () =>
      normalized
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
        .join(" "),
    [normalized],
  );
  const upper = useMemo(() => value.toUpperCase(), [value]);
  const lower = useMemo(() => value.toLowerCase(), [value]);
  const encoded = useMemo(() => encodeURIComponent(value), [value]);
  const decoded = useMemo(() => {
    try {
      return decodeURIComponent(value);
    } catch {
      return "";
    }
  }, [value]);

  return (
    <ToolShell locale={locale} kicker={labels.kicker} title={title} description={description}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <label className="grid gap-2 text-sm text-slate-600">
          {labels.input}
          <textarea
            rows={10}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="rounded-3xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
          />
        </label>

        <div className="grid gap-4">
          <CopyBlock
            label={labels.slug}
            value={slug}
            buttonLabel={locale === "en" ? "Copy" : "复制"}
            copiedLabel={locale === "en" ? "Copied" : "已复制"}
          />
          <CopyBlock
            label={labels.titleCase}
            value={titleCase}
            buttonLabel={locale === "en" ? "Copy" : "复制"}
            copiedLabel={locale === "en" ? "Copied" : "已复制"}
          />
          <div className="grid gap-3 rounded-3xl border border-black/10 bg-slate-50 p-5 text-sm text-slate-700">
            <div>
              <span className="text-slate-500">{labels.trimmed}</span>
              <p className="font-medium text-slate-950">{normalized || "-"}</p>
            </div>
            <div>
              <span className="text-slate-500">{labels.upper}</span>
              <p className="font-medium text-slate-950">{upper}</p>
            </div>
            <div>
              <span className="text-slate-500">{labels.lower}</span>
              <p className="font-medium text-slate-950">{lower}</p>
            </div>
            <div>
              <span className="text-slate-500">{labels.encode}</span>
              <p className="font-medium text-slate-950 break-all">{encoded}</p>
            </div>
            <div>
              <span className="text-slate-500">{labels.decode}</span>
              <p className="font-medium text-slate-950 break-all">{decoded || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

export { ToolShell };
