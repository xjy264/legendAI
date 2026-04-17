import { slugify } from "@/lib/utils";

export type CitationAuthor = {
  given?: string;
  family?: string;
  name?: string;
};

export type CitationRecord = {
  doi: string;
  title: string;
  authors: CitationAuthor[];
  journal?: string;
  year?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  url?: string;
  type?: string;
};

export type CrossrefWork = Record<string, unknown>;

export type CitationResult = {
  doi: string;
  title: string;
  authors: CitationAuthor[];
  authorsLine: string;
  containerTitle: string;
  year: string;
  volume: string;
  issue: string;
  pages: string;
  publisher: string;
  url: string;
  bibtex: string;
  apa: string;
  gbt: string;
};

const DOI_PATTERN = /^10\.\d{4,9}\/\S+$/i;

function firstText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return firstText(value[0]);
  }

  return "";
}

function normalizeAuthor(author: unknown): CitationAuthor {
  if (!author || typeof author !== "object") {
    return {};
  }

  const entry = author as Partial<CitationAuthor> & { "given"?: string; "family"?: string; name?: string };
  return {
    given: typeof entry.given === "string" ? entry.given : undefined,
    family: typeof entry.family === "string" ? entry.family : undefined,
    name: typeof entry.name === "string" ? entry.name : undefined,
  };
}

function formatAuthorName(author: CitationAuthor) {
  const given = author.given?.trim() ?? "";
  const family = author.family?.trim() ?? "";
  const name = author.name?.trim() ?? "";

  if (family || given) {
    return [family, given].filter(Boolean).join(" ").trim();
  }

  return name;
}

function formatAuthorLine(authors: CitationAuthor[]) {
  if (authors.length === 0) {
    return "Anonymous";
  }

  return authors.map((author) => formatAuthorName(author)).filter(Boolean).join(", ");
}

function formatApaAuthor(author: CitationAuthor) {
  const given = author.given?.trim() ?? "";
  const family = author.family?.trim() ?? "";
  const name = author.name?.trim() ?? "";

  if (!family && !given) {
    return name;
  }

  const initials = given
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase()}.`)
    .join(" ");

  return [family, initials].filter(Boolean).join(", ");
}

function citationYear(record: Pick<CitationRecord, "year">) {
  return record.year?.trim() || "n.d.";
}

function sanitizeField(value: string) {
  return value.replace(/[{}]/g, "").trim();
}

function datePartsToYear(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }

  const first = value[0];
  if (!Array.isArray(first) || first.length === 0) {
    return "";
  }

  const year = first[0];
  return typeof year === "number" || typeof year === "string" ? String(year).slice(0, 4) : "";
}

function yearFromMessage(message: Record<string, unknown>) {
  const candidates = [message.published, message["published-print"], message["published-online"], message.issued, message.created];
  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      const year = datePartsToYear((candidate as { "date-parts"?: unknown })["date-parts"]);
      if (year) {
        return year;
      }
    }
  }

  return "";
}

function formatVolumeIssue(record: Pick<CitationRecord, "volume" | "issue">) {
  if (!record.volume) {
    return "";
  }

  return record.issue ? `${record.volume}(${record.issue})` : record.volume;
}

function citationKey(record: CitationRecord) {
  const firstAuthor = record.authors[0];
  const authorSlug = slugify(firstAuthor ? formatAuthorName(firstAuthor) : "citation").replace(/-/g, "");
  const titleSlug = slugify(record.title).replace(/-/g, "").slice(0, 24);
  const year = citationYear(record);
  return `${authorSlug || "citation"}${year}${titleSlug || "work"}`;
}

export function normalizeDoi(input: string) {
  const cleaned = input.trim();
  if (!cleaned) {
    return "";
  }

  return cleaned
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .trim()
    .toLowerCase();
}

export function isValidDoi(input: string) {
  return DOI_PATTERN.test(normalizeDoi(input));
}

export function crossrefMessageToCitationRecord(message: Record<string, unknown>) {
  const doi = normalizeDoi(firstText(message.DOI ?? message.doi));
  return {
    doi,
    title: sanitizeField(firstText(message.title ?? message["container-title"])) || "Untitled",
    authors: Array.isArray(message.author) ? message.author.map(normalizeAuthor).filter((author) => author.given || author.family || author.name) : [],
    journal: sanitizeField(firstText(message["container-title"])),
    year: yearFromMessage(message),
    volume: sanitizeField(firstText(message.volume)),
    issue: sanitizeField(firstText(message.issue)),
    pages: sanitizeField(firstText(message.page)),
    publisher: sanitizeField(firstText(message.publisher)),
    url: sanitizeField(firstText(message.URL ?? message.url)) || (doi ? `https://doi.org/${doi}` : ""),
    type: sanitizeField(firstText(message.type)),
  } satisfies CitationRecord;
}

export function buildCitationResult(work: CrossrefWork): CitationResult {
  const record = crossrefMessageToCitationRecord(work);

  return {
    ...record,
    authorsLine: formatAuthorLine(record.authors),
    containerTitle: record.journal ?? "",
    bibtex: formatBibtex(record),
    apa: formatApa(record),
    gbt: formatGbt(record),
  };
}

export function formatBibtex(record: CitationRecord) {
  const authors = record.authors
    .map((author) => {
      const family = author.family?.trim() ?? "";
      const given = author.given?.trim() ?? "";
      if (family || given) {
        return [family, given].filter(Boolean).join(", ");
      }
      return author.name?.trim() ?? "";
    })
    .filter(Boolean)
    .join(" and ");

  const pages = record.pages?.replace(/-/g, "--");
  const entryType = record.type?.includes("book") ? "book" : "article";
  const fields = [
    ["title", record.title],
    ["author", authors],
    ["journal", record.journal],
    ["publisher", record.publisher],
    ["year", citationYear(record)],
    ["volume", record.volume],
    ["number", record.issue],
    ["pages", pages],
    ["doi", record.doi],
    ["url", record.url ?? (record.doi ? `https://doi.org/${record.doi}` : "")],
  ]
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `  ${key} = {${value}}`);

  return `@${entryType}{${citationKey(record)},\n${fields.join(",\n")}\n}`;
}

export function formatApa(record: CitationRecord) {
  const authors = record.authors.length
    ? record.authors.map(formatApaAuthor).filter(Boolean).join(", ")
    : "Anonymous";
  const year = citationYear(record);
  const sourceParts = [record.journal, formatVolumeIssue(record), record.pages].filter(Boolean);
  const source = sourceParts.length > 0 ? ` ${sourceParts.join(", ")}.` : "";
  const doi = record.doi ? ` https://doi.org/${record.doi}` : "";
  return `${authors} (${year}). ${record.title}.${source}${doi}`.replace(/\s+/g, " ").trim();
}

export function formatGbt(record: CitationRecord) {
  const authors = record.authors.length
    ? record.authors.map(formatAuthorName).filter(Boolean).join(", ")
    : "Anonymous";
  const year = citationYear(record);
  const journal = record.journal ? ` ${record.journal}` : "";
  const volume = formatVolumeIssue(record);
  const pages = record.pages ? `: ${record.pages}` : "";
  const doi = record.doi ? ` DOI: ${record.doi}` : "";
  return `${authors}. ${record.title}[J].${journal}, ${year}${volume ? `, ${volume}` : ""}${pages}.${doi}`.replace(/\s+/g, " ").trim();
}

export async function lookupCitationByDoi(
  doi: string,
  fetchImpl: typeof fetch = fetch,
) {
  const normalized = normalizeDoi(doi);
  if (!isValidDoi(normalized)) {
    throw new Error("invalid-doi");
  }

  const response = await fetchImpl(`https://api.crossref.org/works/${encodeURIComponent(normalized)}`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("fetch-failed");
  }

  const data = (await response.json()) as { message?: Record<string, unknown> };
  if (!data.message) {
    throw new Error("fetch-failed");
  }

  const record = crossrefMessageToCitationRecord(data.message);
  return {
    record,
    bibtex: formatBibtex(record),
    apa: formatApa(record),
    gbt: formatGbt(record),
  };
}
