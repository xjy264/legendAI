"use client";

import Link from "next/link";
import { useState } from "react";
import type { SVGProps } from "react";
import { Copy } from "lucide-react";

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.425 2.865 8.176 6.839 9.504.5.092.682-.217.682-.48 0-.237-.009-.868-.014-1.703-2.782.603-3.369-1.343-3.369-1.343-.455-1.157-1.11-1.466-1.11-1.466-.907-.62.069-.607.069-.607 1.003.071 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.254-.446-1.273.098-2.647 0 0 .84-.27 2.75 1.026a9.58 9.58 0 0 1 5 0c1.909-1.296 2.748-1.026 2.748-1.026.545 1.374.202 2.393.1 2.647.64.7 1.028 1.594 1.028 2.687 0 3.848-2.339 4.695-4.566 4.944.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .266.18.577.688.479A10.02 10.02 0 0 0 22 12.021C22 6.484 17.523 2 12 2Z" />
    </svg>
  );
}

function WeChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9.5 3.75c3.88 0 7 2.52 7 5.62s-3.12 5.63-7 5.63c-.52 0-1.03-.05-1.51-.14L5.9 16.4l.5-2.1C4.98 13.19 3.5 11.48 3.5 9.37c0-3.1 3.12-5.62 7-5.62Z"
        className="fill-emerald-600/15 stroke-emerald-700"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14.4 8.25c2.94 0 5.35 1.84 5.35 4.1 0 1.5-.97 2.83-2.42 3.56l.39 1.57-1.53-1.05c-.49.09-.99.14-1.49.14-2.94 0-5.35-1.84-5.35-4.1s2.41-4.22 5.05-4.22Z"
        className="fill-emerald-600/10 stroke-emerald-700"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8.2" cy="9.1" r="0.9" className="fill-emerald-700" />
      <circle cx="11.2" cy="9.1" r="0.9" className="fill-emerald-700" />
      <circle cx="13.2" cy="12.2" r="0.9" className="fill-emerald-700" />
      <circle cx="16.2" cy="12.2" r="0.9" className="fill-emerald-700" />
    </svg>
  );
}

export function StudioBanner({
  locale,
  title,
  subtitle,
  githubHref,
  wechatValue,
}: {
  locale: "zh" | "en";
  title: string;
  subtitle: string;
  githubHref: string;
  wechatValue: string;
}) {
  const [copied, setCopied] = useState(false);
  const copyLabel = locale === "zh" ? "已复制" : "Copied";
  const wechatLabel = locale === "zh" ? "微信号" : "WeChat";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wechatValue);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-[2rem] border border-black/10 bg-white/76 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl space-y-4">
          <p className="text-xs font-semibold tracking-[0.26em] text-slate-500 uppercase">
            Studio
          </p>
          <h2 className="font-serif text-4xl leading-none font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {title}
          </h2>
          <p className="text-sm leading-7 text-slate-600">{subtitle}</p>
        </div>

        <div className="grid gap-3 sm:min-w-[13.5rem]">
          <Link
            href={githubHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <GithubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </Link>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
          >
            <WeChatIcon className="h-4 w-4" />
            <span>{copied ? copyLabel : wechatLabel}</span>
            <Copy className="h-3.5 w-3.5 opacity-60" />
          </button>
          <p className="text-right text-xs text-slate-500">{wechatValue}</p>
        </div>
      </div>
    </section>
  );
}
