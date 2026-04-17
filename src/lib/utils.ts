export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(value: string | Date, locale: "zh" | "en" = "zh") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function estimateReadingMinutes(text: string) {
  const normalized = text.trim();
  const cjkChars = (normalized.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const words = normalized.replace(/\s+/g, " ").split(" ").filter(Boolean).length;
  const unitCount = Math.max(words, Math.ceil(cjkChars / 2));
  return Math.max(1, Math.ceil(unitCount / 220));
}

export function excerptFromMarkdown(content: string) {
  const normalized = content.replace(/\r\n/g, "\n");
  const paragraph = normalized
    .split("\n\n")
    .map((part) => part.replace(/#+\s+/g, "").trim())
    .find((part) => part.length > 40);

  return (paragraph ?? normalized.slice(0, 160)).replace(/\n+/g, " ").trim();
}

export function toTagList(value: string[] | string | undefined) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((tag) => tag.trim()).filter(Boolean);
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
