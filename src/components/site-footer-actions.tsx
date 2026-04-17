"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { SVGProps } from "react";

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12.02c0 4.43 2.87 8.18 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.84.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.56 9.56 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86 0 1.34-.01 2.42-.01 2.75 0 .26.18.57.69.48A10.02 10.02 0 0 0 22 12.02C22 6.48 17.52 2 12 2Z" />
    </svg>
  );
}

function WeChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9.6 3.75c3.82 0 6.9 2.39 6.9 5.35s-3.08 5.36-6.9 5.36a8.9 8.9 0 0 1-1.68-.16l-2.06 1.43.54-1.9c-1.4-.83-2.58-2.25-2.58-4.13 0-2.96 3.08-5.35 5.78-5.35Z"
        className="fill-emerald-500/10 stroke-emerald-700"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 8.35c2.95 0 5.35 1.79 5.35 4 0 1.44-.93 2.72-2.33 3.43l.35 1.43-1.43-1c-.47.08-.94.12-1.43.12-2.95 0-5.35-1.79-5.35-4s2.4-3.98 4.84-3.98Z"
        className="fill-emerald-500/8 stroke-emerald-700"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8.1" cy="9.15" r="0.9" className="fill-emerald-700" />
      <circle cx="11" cy="9.15" r="0.9" className="fill-emerald-700" />
      <circle cx="13.2" cy="12.25" r="0.9" className="fill-emerald-700" />
      <circle cx="16.1" cy="12.25" r="0.9" className="fill-emerald-700" />
    </svg>
  );
}

function QrModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/40 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="WeChat QR code"
      onClick={onClose}
    >
      <div className="mx-auto flex h-full max-w-md items-center justify-center">
        <div
          className="w-full rounded-[2rem] border border-black/10 bg-white p-4 shadow-[0_30px_100px_rgba(15,23,42,0.28)]"
          onClick={(event) => event.stopPropagation()}
        >
          <Image
            src="/af9f85ccd13dca73b53d175233bc0364.jpg"
            alt="WeChat QR code"
            width={900}
            height={900}
            className="h-auto w-full rounded-[1.5rem] object-cover"
            priority
          />
          <p className="mt-3 text-center text-sm text-slate-600">点击外部或按 Esc 关闭</p>
        </div>
      </div>
    </div>
  );
}

export function SiteFooterActions({ label }: { label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium tracking-tight text-slate-700">{label}</p>
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/xjy264"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 hover:bg-white"
            aria-label="GitHub"
          >
            <GithubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 hover:bg-white"
            aria-label="WeChat QR code"
          >
            <WeChatIcon className="h-4 w-4" />
            <span>WeChat</span>
          </button>
        </div>
      </div>

      <QrModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
