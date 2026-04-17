"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { normalizeDoi, type CitationResult as CitationResultData } from "@/lib/citation";

type ToolsCopy = {
  locale: "zh" | "en";
  colorTitle: string;
  colorDescription: string;
  hexLabel: string;
  rgbTitle: string;
  timestampTitle: string;
  timestampLabel: string;
  slugTitle: string;
  slugLabel: string;
  invalidTimestamp: string;
  citationTitle: string;
  citationDescription: string;
  doiLabel: string;
  lookupButton: string;
  loading: string;
  metadataTitle: string;
  titleLabel: string;
  authorsLabel: string;
  yearLabel: string;
  venueLabel: string;
  doiFieldLabel: string;
  formatsTitle: string;
  bibtexLabel: string;
  apaLabel: string;
  gbtLabel: string;
  copyButton: string;
  copied: string;
  invalidDoi: string;
  fetchFailed: string;
};

type CitationFormat = "bibtex" | "apa" | "gbt";

function normalizeHex(value: string) {
  const cleaned = value.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return cleaned
      .split("")
      .map((char) => char + char)
      .join("")
      .toLowerCase();
  }

  return /^[0-9a-fA-F]{6}$/.test(cleaned) ? cleaned.toLowerCase() : "";
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex);
  if (!normalized) {
    return null;
  }

  const value = Number.parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => Math.min(255, Math.max(0, value)).toString(16).padStart(2, "0"))
    .join("")}`;
}

function unixToDate(input: string, invalidMessage: string, locale: "zh" | "en") {
  const value = Number(input);
  if (Number.isNaN(value)) {
    return invalidMessage;
  }

  const milliseconds = input.length <= 10 ? value * 1000 : value;
  return new Date(milliseconds).toLocaleString(locale === "en" ? "en-US" : "zh-CN");
}

function slugifyText(input: string) {
  return input
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function MetadataField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
      <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">{label}</p>
      <p className="mt-2 break-words text-sm leading-6 text-slate-900">{value}</p>
    </div>
  );
}

function CitationBlock({
  label,
  value,
  onCopy,
  copied,
  copyLabel,
  copiedLabel,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  copyLabel: string;
  copiedLabel: string;
}) {
  return (
    <div className="grid gap-3 rounded-3xl border border-black/10 bg-white/80 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-950">{label}</p>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-full border border-black/10 bg-slate-950 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <textarea
        readOnly
        value={value}
        rows={7}
        className="min-h-36 rounded-2xl border border-black/10 bg-white px-4 py-3 font-mono text-xs leading-6 text-slate-900 outline-none"
      />
    </div>
  );
}

export function ToolsClient({ copy }: { copy: ToolsCopy }) {
  const [hexInput, setHexInput] = useState("#0f766e");
  const [rgbInput, setRgbInput] = useState({ r: 15, g: 118, b: 110 });
  const [timestampInput, setTimestampInput] = useState("1713312000");
  const [titleInput, setTitleInput] = useState("Reading notes for diffusion models");
  const [doiInput, setDoiInput] = useState("10.1038/s41586-020-2649-2");
  const [citationResult, setCitationResult] = useState<CitationResultData | null>(null);
  const [citationError, setCitationError] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<CitationFormat | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const previewRgb = useMemo(() => hexToRgb(hexInput), [hexInput]);
  const previewHex = rgbToHex(rgbInput.r, rgbInput.g, rgbInput.b);
  const timestampOutput = unixToDate(timestampInput, copy.invalidTimestamp, copy.locale);
  const slug = slugifyText(titleInput);

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedDoi = normalizeDoi(doiInput);

    if (!normalizedDoi) {
      setCitationResult(null);
      setCitationError(copy.invalidDoi);
      return;
    }

    setIsLookingUp(true);
    setCitationError("");
    setCopiedFormat(null);

    try {
      const response = await fetch(`/api/tools/citation?doi=${encodeURIComponent(normalizedDoi)}`);
      const payload = (await response.json()) as { citation?: CitationResultData; error?: string };

      if (!response.ok || !payload.citation) {
        throw new Error(payload.error ?? "fetch-failed");
      }

      setCitationResult(payload.citation);
      setCitationError("");
    } catch {
      setCitationResult(null);
      setCitationError(copy.fetchFailed);
    } finally {
      setIsLookingUp(false);
    }
  }

  async function handleCopy(value: string, format: CitationFormat) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedFormat(format);

      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = window.setTimeout(() => {
        setCopiedFormat(null);
      }, 1200);
    } catch {
      setCitationError(copy.fetchFailed);
    }
  }

  return (
    <div className="grid gap-6">
      <section
        id="color-converter"
        className="rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase">
              {copy.colorTitle}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {copy.colorDescription}
            </h3>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm text-slate-600">
              {copy.hexLabel}
              <input
                value={hexInput}
                onChange={(event) => setHexInput(event.target.value)}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none ring-0 transition focus:border-emerald-300"
              />
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["r", "g", "b"] as const).map((key) => (
                <label key={key} className="grid gap-2 text-sm text-slate-600">
                  {key.toUpperCase()}
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgbInput[key]}
                    onChange={(event) =>
                      setRgbInput((current) => ({
                        ...current,
                        [key]: Number(event.target.value),
                      }))
                    }
                    className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none ring-0 transition focus:border-emerald-300"
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <div
              className="min-h-32 rounded-3xl border border-black/10 shadow-inner"
              style={{ backgroundColor: previewHex }}
            />
            <div className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
              <p>RGB: {previewRgb ? `rgb(${previewRgb.r}, ${previewRgb.g}, ${previewRgb.b})` : "invalid"}</p>
              <p className="mt-1">HEX: {previewHex}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="timestamp-converter"
        className="rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      >
        <p className="text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase">
          {copy.timestampTitle}
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          {copy.timestampLabel}
        </h3>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <label className="grid gap-2 text-sm text-slate-600">
            Timestamp
            <input
              value={timestampInput}
              onChange={(event) => setTimestampInput(event.target.value)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none ring-0 transition focus:border-emerald-300"
            />
          </label>
          <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-100">
            {timestampOutput}
          </div>
        </div>
      </section>

      <section
        id="citation-converter"
        className="rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      >
        <p className="text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase">
          {copy.citationTitle}
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          {copy.citationDescription}
        </h3>

        <form onSubmit={handleLookup} className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="grid gap-2 text-sm text-slate-600">
            {copy.doiLabel}
            <input
              value={doiInput}
              onChange={(event) => setDoiInput(event.target.value)}
              placeholder="10.1038/s41586-020-2649-2"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none ring-0 transition focus:border-emerald-300"
            />
          </label>
          <button
            type="submit"
            disabled={isLookingUp}
            className="mt-7 h-fit rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLookingUp ? copy.loading : copy.lookupButton}
          </button>
        </form>

        {citationError ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {citationError}
          </div>
        ) : null}

        {citationResult ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-4">
              <div className="rounded-3xl border border-black/10 bg-white/80 p-4">
                <p className="text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase">
                  {copy.metadataTitle}
                </p>
                <div className="mt-4 grid gap-3">
                  <MetadataField label={copy.titleLabel} value={citationResult.title} />
                  <MetadataField label={copy.authorsLabel} value={citationResult.authorsLine || "Anonymous"} />
                  <MetadataField label={copy.yearLabel} value={citationResult.year || "n.d."} />
                  <MetadataField label={copy.venueLabel} value={citationResult.containerTitle || "—"} />
                  <MetadataField label={copy.doiFieldLabel} value={citationResult.doi || doiInput} />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <p className="text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase">
                {copy.formatsTitle}
              </p>
              <CitationBlock
                label={copy.bibtexLabel}
                value={citationResult.bibtex}
                copied={copiedFormat === "bibtex"}
                copyLabel={copy.copyButton}
                copiedLabel={copy.copied}
                onCopy={() => handleCopy(citationResult.bibtex, "bibtex")}
              />
              <CitationBlock
                label={copy.apaLabel}
                value={citationResult.apa}
                copied={copiedFormat === "apa"}
                copyLabel={copy.copyButton}
                copiedLabel={copy.copied}
                onCopy={() => handleCopy(citationResult.apa, "apa")}
              />
              <CitationBlock
                label={copy.gbtLabel}
                value={citationResult.gbt}
                copied={copiedFormat === "gbt"}
                copyLabel={copy.copyButton}
                copiedLabel={copy.copied}
                onCopy={() => handleCopy(citationResult.gbt, "gbt")}
              />
            </div>
          </div>
        ) : null}
      </section>

      <section
        id="slug-helper"
        className="rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      >
        <p className="text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase">
          {copy.slugTitle}
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          {copy.slugLabel}
        </h3>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <label className="grid gap-2 text-sm text-slate-600">
            Title
            <input
              value={titleInput}
              onChange={(event) => setTitleInput(event.target.value)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none ring-0 transition focus:border-emerald-300"
            />
          </label>
          <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-100">{slug}</div>
        </div>
      </section>
    </div>
  );
}
