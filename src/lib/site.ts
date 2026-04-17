export const site = {
  name: "XJY Stack",
  shortName: "XJY",
  description:
    "A personal technical stack for papers, projects, release notes, and long-term writing.",
  author: "XJY",
  adminPath: "/studio/xjy-7a9f",
  nav: [
    { href: "/", label: "Home" },
    { href: "/articles", label: "Articles" },
    { href: "/projects", label: "Projects" },
    { href: "/tools", label: "Tools" },
    { href: "/guestbook", label: "Guestbook" },
    { href: "/about", label: "About" },
  ],
};

export const homepageStats = [
  { label: "Papers read", value: "18+" },
  { label: "Projects built", value: "9" },
  { label: "Backfill ready", value: "2019-2026" },
  { label: "Update rhythm", value: "Weekly" },
];

export const projectShowcase = [
  {
    title: "Paper notes system",
    description:
      "A living archive for reading notes, implementation experiments, and follow-up thoughts.",
    stack: ["Next.js", "Prisma", "Markdown"],
    status: "Active",
  },
  {
    title: "Research replay",
    description:
      "Backfills older work into a consistent timeline so the site reads like a real technical journal.",
    stack: ["Archive", "Essay", "Timeline"],
    status: "In progress",
  },
  {
    title: "Utility desk",
    description:
      "Small tools that keep the site useful even when there is no new article that day.",
    stack: ["Color", "Time", "Slug"],
    status: "Shipped",
  },
];

export const toolShowcase = [
  {
    title: "Color converter",
    description: "Convert hex, rgb, and hsl values while previewing the color.",
    href: "/tools#color-converter",
  },
  {
    title: "Timestamp converter",
    description: "Turn Unix timestamps into readable dates and vice versa.",
    href: "/tools#timestamp-converter",
  },
  {
    title: "Slug helper",
    description: "Turn article titles into clean publishing slugs.",
    href: "/tools#slug-helper",
  },
];

export const releaseNotes = [
  {
    version: "v0.1",
    date: "2026-04-17",
    notes: ["Launched the stack layout", "Added Markdown publishing", "Protected the hidden admin intake"],
  },
  {
    version: "v0.2",
    date: "planned",
    notes: ["Add OG image generation", "Add search", "Add RSS"],
  },
];
