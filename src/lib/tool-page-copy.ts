import { type Locale } from "@/lib/i18n";

export function getToolPageCopy(locale: Locale) {
  if (locale === "en") {
    return {
      doi: {
        title: "DOI citation converter",
        description: "Look up a DOI and export copy-ready BibTeX, APA, and GB/T 7714 references.",
      },
      frontmatter: {
        title: "Frontmatter generator",
        description: "Generate clean Markdown frontmatter for papers, notes, and drafts.",
      },
      time: {
        title: "Timestamp converter",
        description: "Convert between Unix timestamps and readable local dates.",
      },
      text: {
        title: "Text utilities",
        description: "Turn rough text into slugs, clean casing, and URL-safe strings.",
      },
    };
  }

  return {
    doi: {
      title: "DOI 引文转换器",
      description: "输入 DOI，输出可直接复制的 BibTeX、APA 和 GB/T 7714 引用。",
    },
    frontmatter: {
      title: "Frontmatter 生成器",
      description: "给论文、笔记和草稿快速生成干净的 Markdown 头部。",
    },
    time: {
      title: "时间戳转换器",
      description: "在 Unix 时间戳和可读时间之间互相转换。",
    },
    text: {
      title: "文本工具",
      description: "把原始文本整理成 slug、规范大小写和可 URL 使用的字符串。",
    },
  };
}
