import "server-only";

import { Locale, localizedPath } from "@/lib/i18n";

type SiteData = {
  site: {
    name: string;
    shortName: string;
    description: string;
    author: string;
    adminPath: string;
  };
  nav: Array<{ path: string; label: string }>;
  switcher: { label: string };
  common: {
    footer: string;
    editorNote: string;
    submit: string;
    readArchive: string;
    submitMarkdown: string;
    featured: string;
    previous: string;
    next: string;
    backToArchive: string;
    emptyGuestbook: string;
    published: string;
    updated: string;
    invalidPassword: string;
  };
  home: {
    badge: string;
    title: string;
    description: string;
    signalKicker: string;
    signalTitle: string;
    signalDescription: string;
    latestBlogKicker: string;
    latestBlogTitle: string;
    latestBlogDescription: string;
    latestProjectKicker: string;
    latestProjectTitle: string;
    latestProjectDescription: string;
    toolsKicker: string;
    toolsTitle: string;
    toolsDescription: string;
  };
  stats: Array<{ label: string; value: string; note?: string }>;
  projects: Array<{
    title: string;
    description: string;
    stack: string[];
    status: string;
    updatedAt: string;
  }>;
  tools: Array<{
    title: string;
    description: string;
    href: string;
  }>;
  releaseNotes: Array<{
    version: string;
    date: string;
    notes: string[];
  }>;
  articles: {
    archiveKicker: string;
    archiveTitle: string;
    archiveDescription: string;
    articleKicker: string;
    previous: string;
    next: string;
    submitAnother: string;
  };
  guestbook: {
    kicker: string;
    title: string;
    description: string;
    posted: string;
    name: string;
    message: string;
    submit: string;
  };
  about: {
    kicker: string;
    title: string;
    description: string;
    body1: string;
    body2: string;
    cards: Array<{ title: string; description: string }>;
  };
  toolsPage: {
    kicker: string;
    title: string;
    description: string;
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
  admin: {
    kicker: string;
    title: string;
    description: string;
    password: string;
    markdownFile: string;
    pasteMarkdown: string;
    submit: string;
    recentPosts: string;
    saved: string;
    placeholder: string;
  };
  notFound: {
    kicker: string;
    title: string;
    backHome: string;
  };
};

const zh: SiteData = {
  site: {
    name: "LegendAI",
    shortName: "LegendAI",
    description: "LegendAI 是传奇不会飞的个人站，放论文、项目和长期写作。",
    author: "传奇不会飞",
    adminPath: "/studio/xjy-7a9f",
  },
  nav: [
    { path: "/", label: "首页" },
    { path: "/articles", label: "文章" },
    { path: "/projects", label: "项目" },
    { path: "/tools", label: "工具" },
    { path: "/guestbook", label: "留言" },
    { path: "/about", label: "关于" },
  ],
  switcher: { label: "English" },
  common: {
    footer: "创作让这个地方一直活着。",
    editorNote: "隐藏投稿入口",
    submit: "提交",
    readArchive: "看归档",
    submitMarkdown: "提交 Markdown",
    featured: "精选",
    previous: "上一篇",
    next: "下一篇",
    backToArchive: "回到归档",
    emptyGuestbook: "现在还没有留言，先留一句也可以。",
    published: "已经发布了。",
    updated: "最近更新",
    invalidPassword: "密码不对，再试一次。",
  },
  home: {
    badge: "LegendAI · Dispatch",
    title: "在论文、项目和长期写作里，给自己留一个工作台",
    description:
      "读完一篇论文，我会把能说清楚的地方写下来；做完一个项目，我会把关键决策留下来；旧年份也会慢慢补齐。",
    signalKicker: "正在写",
    signalTitle: "论文、项目、回填",
    signalDescription: "这不是一次性展示页，而是我会一直往里填东西的地方。",
    latestBlogKicker: "最近写的博客",
    latestBlogTitle: "最近留下来的内容",
    latestBlogDescription: "先看最新的几篇，能最快知道我最近在想什么。",
    latestProjectKicker: "最近做的项目",
    latestProjectTitle: "最近在推进的东西",
    latestProjectDescription: "把还在动的项目放前面，比静态履历更有用。",
    toolsKicker: "小工具",
    toolsTitle: "顺手的小台子",
    toolsDescription: "文章之外留一点实用感。",
  },
  stats: [
    { label: "读过的论文", value: "18+" },
    { label: "做过的项目", value: "9" },
    { label: "回填跨度", value: "2019-2026" },
    { label: "更新节奏", value: "按周" },
  ],
  projects: [
    {
      title: "论文笔记系统",
      description: "把阅读、实验和复盘放进同一个地方，方便后面继续写。",
      stack: ["Next.js", "Prisma", "Markdown"],
      status: "运行中",
      updatedAt: "2026-04-15",
    },
    {
      title: "研究回放",
      description: "把过去做过的事情一篇篇补回来，时间线就会慢慢完整。",
      stack: ["回填", "笔记", "时间线"],
      status: "进行中",
      updatedAt: "2026-03-28",
    },
    {
      title: "工具台",
      description: "放一些轻量工具，避免站点只在发文时才有存在感。",
      stack: ["颜色", "时间", "Slug"],
      status: "已上线",
      updatedAt: "2026-04-02",
    },
  ],
  tools: [
    {
      title: "DOI 引文转换器",
      description: "输入 DOI，生成可以直接复制的 BibTeX、APA 和 GB/T 引文。",
      href: localizedPath("zh", "/tools/doi"),
    },
    {
      title: "Frontmatter 生成器",
      description: "给论文、笔记和草稿快速生成干净的 Markdown 头部。",
      href: localizedPath("zh", "/tools/frontmatter"),
    },
    {
      title: "时间戳换算器",
      description: "把 Unix 时间戳转成好读的时间，也可以反过来。",
      href: localizedPath("zh", "/tools/time"),
    },
    {
      title: "文本工具",
      description: "把原始文本整理成 slug、清理空格和可 URL 使用的字符串。",
      href: localizedPath("zh", "/tools/text"),
    },
  ],
  releaseNotes: [
    {
      version: "v0.1",
      date: "2026-04-17",
      notes: ["站点骨架上线", "支持 Markdown 投稿", "隐藏后台入口已加密"],
    },
    {
      version: "v0.2",
      date: "规划中",
      notes: ["补 OG 图", "补搜索", "补 RSS"],
    },
  ],
  articles: {
    archiveKicker: "归档",
    archiveTitle: "文章",
    archiveDescription: "按时间排好的论文笔记、项目记录和长期写作。",
    articleKicker: "文章",
    previous: "上一篇",
    next: "下一篇",
    submitAnother: "继续投稿",
  },
  guestbook: {
    kicker: "留言板",
    title: "留一句话",
    description: "公开留言会和站内内容放在一起，页面会更像一个一直在工作的地方。",
    posted: "留言已发布。",
    name: "名字",
    message: "内容",
    submit: "发布留言",
  },
  about: {
    kicker: "关于",
    title: "LegendAI",
    description: "为论文、项目和写作准备的工作台。",
    body1:
      "我更想把它做成一个一直能用、一直能写的地方，而不是一页很快过时的介绍页。",
    body2:
      "前台尽量干净，后台只负责接 Markdown 和保存元信息。内容可以慢慢长出来，旧年份也可以后补。",
    cards: [
      { title: "读论文", description: "把难懂的内容写成以后还能看懂的笔记。" },
      { title: "做项目", description: "把实验和实现过程留下来，别只剩提交记录。" },
      { title: "补旧内容", description: "把以前没来得及写的年份慢慢补齐。" },
      { title: "继续写", description: "让更新保持顺手，别把发文变成负担。" },
    ],
  },
  toolsPage: {
    kicker: "工具",
    title: "顺手的小台子",
    description: "几个轻量工具，给文章之外留一点实用感。",
    colorTitle: "颜色换算器",
    colorDescription: "边看预览边换算 hex、rgb 和 hsl。",
    hexLabel: "Hex 值",
    rgbTitle: "Hex、RGB 和预览",
    timestampTitle: "时间戳换算器",
    timestampLabel: "Unix 转可读时间",
    slugTitle: "Slug 生成器",
    slugLabel: "把标题整理成干净的 slug",
    invalidTimestamp: "请输入有效的 Unix 时间戳",
    citationTitle: "DOI 引文转换器",
    citationDescription: "输入 DOI，自动拉取论文元数据，并生成 BibTeX、APA 和 GB/T 7714。",
    doiLabel: "DOI",
    lookupButton: "查询引文",
    loading: "正在查询...",
    metadataTitle: "元数据",
    titleLabel: "题名",
    authorsLabel: "作者",
    yearLabel: "年份",
    venueLabel: "刊源",
    doiFieldLabel: "DOI",
    formatsTitle: "引文格式",
    bibtexLabel: "BibTeX",
    apaLabel: "APA",
    gbtLabel: "GB/T 7714",
    copyButton: "复制",
    copied: "已复制",
    invalidDoi: "请输入有效的 DOI",
    fetchFailed: "未能获取这条 DOI 的元数据",
  },
  admin: {
    kicker: "隐藏后台",
    title: "Markdown 投稿入口",
    description: "隐藏入口，Markdown 直接投稿，密码校验在服务端完成。",
    password: "密码",
    markdownFile: "Markdown 文件",
    pasteMarkdown: "粘贴 Markdown",
    submit: "发布文章",
    recentPosts: "最近文章",
    saved: "保存成功",
    placeholder: `---\ntitle: 一篇论文笔记\ndescription: 这篇文章为什么值得记下来。\ntags: [paper, notes]\ncategory: paper\nstatus: published\nfeatured: true\npublishedAt: 2025-09-20\n---\n\n在这里粘贴你的 Markdown 内容。`,
  },
  notFound: {
    kicker: "未找到",
    title: "这个页面不存在。",
    backHome: "返回首页",
  },
};

const en: SiteData = {
  site: {
    name: "LegendAI",
    shortName: "LegendAI",
    description: "LegendAI is a living home for papers, projects, and long-form notes.",
    author: "传奇不会飞",
    adminPath: "/studio/xjy-7a9f",
  },
  nav: [
    { path: "/", label: "Home" },
    { path: "/articles", label: "Articles" },
    { path: "/projects", label: "Projects" },
    { path: "/tools", label: "Tools" },
    { path: "/guestbook", label: "Guestbook" },
    { path: "/about", label: "About" },
  ],
  switcher: { label: "中文" },
  common: {
    footer: "LegendAI keeps papers, projects, and long-form notes in one living place.",
    editorNote: "Hidden submission path",
    submit: "Submit",
    readArchive: "Read archive",
    submitMarkdown: "Submit Markdown",
    featured: "Featured",
    previous: "Previous",
    next: "Next",
    backToArchive: "Back to archive",
    emptyGuestbook: "No guestbook entries yet. Leave the first line.",
    published: "Published.",
    updated: "Updated",
    invalidPassword: "Wrong password. Try again.",
  },
  home: {
    badge: "LegendAI / 传奇不会飞",
    title: "A living home for papers, projects, and long-form notes",
    description:
      "I use this site like a long-running notebook: papers turn into notes, projects turn into records, and older years get filled in when I have time.",
    signalKicker: "Current mode",
    signalTitle: "Read, build, backfill",
    signalDescription:
      "This is not a one-off portfolio page. It is a place I keep feeding over time, at the same pace as my research and writing.",
    latestBlogKicker: "Recent writing",
    latestBlogTitle: "Latest posts",
    latestBlogDescription: "The freshest things on the site, sorted by the last time I touched them.",
    latestProjectKicker: "Recent projects",
    latestProjectTitle: "What is moving now",
    latestProjectDescription: "The most active work gets the front slot.",
    toolsKicker: "Tools",
    toolsTitle: "Small utilities",
    toolsDescription: "A few lightweight tools so the site still feels useful between posts.",
  },
  stats: [
    { label: "Papers read", value: "18+" },
    { label: "Projects built", value: "9" },
    { label: "Backfill span", value: "2019-2026" },
    { label: "Posting pace", value: "Weekly" },
  ],
  projects: [
    {
      title: "Paper notes system",
      description: "A single place for reading notes, experiments, and follow-up thoughts.",
      stack: ["Next.js", "Prisma", "Markdown"],
      status: "Running",
      updatedAt: "2026-04-15",
    },
    {
      title: "Research replay",
      description: "Backfills older work into one timeline so the archive feels coherent.",
      stack: ["Archive", "Essay", "Timeline"],
      status: "In progress",
      updatedAt: "2026-03-28",
    },
    {
      title: "Utility desk",
      description: "Small tools that keep the site useful even on quiet writing weeks.",
      stack: ["Color", "Time", "Slug"],
      status: "Live",
      updatedAt: "2026-04-02",
    },
  ],
  tools: [
    {
      title: "DOI citation converter",
      description: "Paste a DOI and generate copy-ready BibTeX, APA, and GB/T 7714 references.",
      href: localizedPath("en", "/tools/doi"),
    },
    {
      title: "Frontmatter generator",
      description: "Create clean Markdown frontmatter for papers, notes, and drafts.",
      href: localizedPath("en", "/tools/frontmatter"),
    },
    {
      title: "Timestamp converter",
      description: "Convert Unix timestamps into readable times and back again.",
      href: localizedPath("en", "/tools/time"),
    },
    {
      title: "Text utilities",
      description: "Turn rough text into slugs, clean casing, and URL-safe strings.",
      href: localizedPath("en", "/tools/text"),
    },
  ],
  releaseNotes: [
    {
      version: "v0.1",
      date: "2026-04-17",
      notes: ["Launched the stack skeleton", "Added Markdown publishing", "Locked down the hidden editor"],
    },
    {
      version: "v0.2",
      date: "planned",
      notes: ["Add OG images", "Add search", "Add RSS"],
    },
  ],
  articles: {
    archiveKicker: "Archive",
    archiveTitle: "Articles",
    archiveDescription: "A time-ordered archive of papers, project notes, and long-form writing.",
    articleKicker: "Article",
    previous: "Previous",
    next: "Next",
    submitAnother: "Submit another post",
  },
  guestbook: {
    kicker: "Guestbook",
    title: "Leave a line",
    description: "Public notes live next to the site content so the page feels active.",
    posted: "Your note has been published.",
    name: "Name",
    message: "Message",
    submit: "Publish note",
  },
  about: {
    kicker: "About",
    title: "Why LegendAI exists",
    description: "I wanted a site that feels like a desk I can keep working on, not a brochure.",
    body1:
      "This site is built for the way I actually write: read something, think about it, then turn it into a note that still makes sense months later.",
    body2:
      "The front end acts like a personal workspace. The hidden editor accepts Markdown, keeps the original file, and stores metadata so the archive can grow without losing shape.",
    cards: [
      { title: "Read papers", description: "Turn dense papers into notes I can reuse later." },
      { title: "Build projects", description: "Keep experiments visible instead of hiding them in commits." },
      { title: "Backfill years", description: "Fill in the missing timeline when I have time." },
      { title: "Keep writing", description: "Make posting feel light enough to stay consistent." },
    ],
  },
  toolsPage: {
    kicker: "Tools",
    title: "Small utilities",
    description: "A few lightweight tools that keep the site useful between posts.",
    colorTitle: "Color converter",
    colorDescription: "Convert hex, rgb, and hsl while previewing the result.",
    hexLabel: "Hex value",
    rgbTitle: "Hex, RGB, and preview",
    timestampTitle: "Timestamp converter",
    timestampLabel: "Unix to readable time",
    slugTitle: "Slug helper",
    slugLabel: "Turn titles into clean slugs",
    invalidTimestamp: "Enter a valid Unix timestamp",
    citationTitle: "DOI citation converter",
    citationDescription: "Paste a DOI, fetch the paper metadata, and generate BibTeX, APA, and GB/T 7714.",
    doiLabel: "DOI",
    lookupButton: "Look up citation",
    loading: "Looking up...",
    metadataTitle: "Metadata",
    titleLabel: "Title",
    authorsLabel: "Authors",
    yearLabel: "Year",
    venueLabel: "Venue",
    doiFieldLabel: "DOI",
    formatsTitle: "Citation formats",
    bibtexLabel: "BibTeX",
    apaLabel: "APA",
    gbtLabel: "GB/T 7714",
    copyButton: "Copy",
    copied: "Copied",
    invalidDoi: "Enter a valid DOI",
    fetchFailed: "Could not fetch metadata for that DOI",
  },
  admin: {
    kicker: "Hidden editor",
    title: "Markdown intake",
    description: "Submit posts through a hidden path. Password validation happens on the server.",
    password: "Password",
    markdownFile: "Markdown file",
    pasteMarkdown: "Paste Markdown",
    submit: "Publish post",
    recentPosts: "Recent posts",
    saved: "Saved successfully",
    placeholder: `---\ntitle: A paper note\ndescription: Why this paper is worth keeping.\ntags: [paper, notes]\ncategory: paper\nstatus: published\nfeatured: true\npublishedAt: 2025-09-20\n---\n\nPaste your Markdown content here.`,
  },
  notFound: {
    kicker: "Not found",
    title: "That page does not exist.",
    backHome: "Go home",
  },
};

export function getSiteContent(locale: Locale) {
  return locale === "en" ? en : zh;
}
