import Link from "next/link";
import { notFound } from "next/navigation";

import { PostCard, ProjectCard, StatCard, ToolCard } from "@/components/cards";
import { MarkdownContent } from "@/components/markdown";
import { SectionHeading } from "@/components/section-heading";
import { ToolsClient } from "@/components/tools-client";
import { getPostBySlug, listPublishedPosts, listRecentPosts } from "@/lib/content";
import { Locale, localizedPath } from "@/lib/i18n";
import { listGuestbookEntries as listGuestbookEntriesFromDb } from "@/lib/guestbook";
import { getSiteContent } from "@/lib/site-content";
import { formatDate } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type Params = Promise<{ slug: string }>;

export async function HomePageContent({ locale }: { locale: Locale }) {
  const content = getSiteContent(locale);
  const [posts, entries] = await Promise.all([listPublishedPosts(), listGuestbookEntriesFromDb()]);
  const latestPosts = posts.slice(0, 2);
  const latestProjects = [...content.projects]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 2);
  const toolCards = content.tools.slice(0, 4);

  return (
    <div className="grid gap-10 lg:gap-14">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase">
            {content.home.badge}
          </span>
          <h1 className="max-w-4xl text-5xl leading-none font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            {content.home.title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            {content.home.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={localizedPath(locale, "/articles")}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {content.common.readArchive}
            </Link>
            <Link
              href={localizedPath(locale, "/projects")}
              className="rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm font-medium text-slate-900 backdrop-blur-xl transition hover:border-emerald-200 hover:bg-white"
            >
              {content.home.latestProjectTitle}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-[2rem] border border-black/10 bg-white/65 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="rounded-[1.75rem] border border-black/10 bg-slate-950 p-5 text-white">
            <p className="text-xs font-semibold tracking-[0.24em] text-emerald-300 uppercase">
              {content.home.signalKicker}
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {content.home.signalTitle}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {content.home.signalDescription}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {content.stats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-5">
          <SectionHeading
            kicker={content.home.latestBlogKicker}
            title={content.home.latestBlogTitle}
            description={content.home.latestBlogDescription}
          />
          <div className="grid gap-4">
            {latestPosts.map((post) => (
              <PostCard
                href={localizedPath(locale, `/articles/${post.slug}`)}
                key={post.slug}
                {...post}
                displayAt={post.updatedAt}
                featuredLabel={content.common.featured}
                locale={locale}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <SectionHeading
            kicker={content.home.latestProjectKicker}
            title={content.home.latestProjectTitle}
            description={content.home.latestProjectDescription}
          />
          <div className="grid gap-4">
            {latestProjects.map((project) => (
              <ProjectCard
                key={project.title}
                {...project}
                locale={locale}
                updatedLabel={content.common.updated}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-5">
          <SectionHeading
            kicker={content.home.toolsKicker}
            title={content.home.toolsTitle}
            description={content.home.toolsDescription}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {toolCards.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <SectionHeading
            kicker={content.guestbook.kicker}
            title={content.guestbook.title}
            description={content.guestbook.description}
          />
          <div className="grid gap-4">
            {entries.slice(0, 3).map((entry) => (
              <article
                key={entry.id}
                className="rounded-3xl border border-black/10 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-950">{entry.name}</h3>
                  <span className="text-xs text-slate-500">
                    {entry.createdAt.toLocaleDateString(locale === "en" ? "en-US" : "zh-CN")}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{entry.message}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      </div>
  );
}

export async function ArticlesPageContent({ locale }: { locale: Locale }) {
  const content = getSiteContent(locale);
  const posts = await listPublishedPosts();

  return (
    <div className="grid gap-6">
      <SectionHeading
        kicker={content.articles.archiveKicker}
        title={content.articles.archiveTitle}
        description={content.articles.archiveDescription}
      />
      <div className="grid gap-4">
        {posts.map((post) => (
          <PostCard
            href={localizedPath(locale, `/articles/${post.slug}`)}
            key={post.slug}
            {...post}
            displayAt={post.updatedAt}
            featuredLabel={content.common.featured}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}

export async function ArticlePageContent({
  params,
  locale,
}: {
  params: Params;
  locale: Locale;
}) {
  const { slug } = await params;
  const content = getSiteContent(locale);
  const [post, allPosts] = await Promise.all([getPostBySlug(slug), listPublishedPosts()]);

  if (!post) {
    notFound();
  }

  const index = allPosts.findIndex((item) => item.slug === post.slug);
  const previous = index > 0 ? allPosts[index - 1] : null;
  const next = index >= 0 && index < allPosts.length - 1 ? allPosts[index + 1] : null;

  return (
    <div className="grid gap-6">
      <SectionHeading
        kicker={content.articles.articleKicker}
        title={post.title}
        description={post.description}
      />

      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>{formatDate(post.publishedAt, locale)}</span>
        <span>路</span>
        <span>{post.readingMinutes} min read</span>
        <span>路</span>
        <span>{post.category}</span>
        <span>路</span>
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/70 px-3 py-1">
            #{tag}
          </span>
        ))}
      </div>

      <MarkdownContent content={post.content} />

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href={previous ? localizedPath(locale, `/articles/${previous.slug}`) : localizedPath(locale, "/articles")}
          className="rounded-3xl border border-black/10 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition hover:border-emerald-200"
        >
          <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
            {content.articles.previous}
          </p>
          <p className="mt-3 font-semibold text-slate-950">
            {previous ? previous.title : content.common.backToArchive}
          </p>
        </Link>
        <Link
          href={next ? localizedPath(locale, `/articles/${next.slug}`) : localizedPath(locale, "/articles")}
          className="rounded-3xl border border-black/10 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition hover:border-emerald-200"
        >
          <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
            {next ? content.articles.next : content.common.backToArchive}
          </p>
          <p className="mt-3 font-semibold text-slate-950">
            {next ? next.title : content.common.backToArchive}
          </p>
        </Link>
      </div>
    </div>
  );
}

export async function GuestbookPageContent({
  searchParams,
  locale,
}: {
  searchParams: SearchParams;
  locale: Locale;
}) {
  const content = getSiteContent(locale);
  const params = await searchParams;
  const entries = await listGuestbookEntriesFromDb();
  const posted = params.posted === "1";

  return (
    <div className="grid gap-6">
      <SectionHeading
        kicker={content.guestbook.kicker}
        title={content.guestbook.title}
        description={content.guestbook.description}
      />

      {posted ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          {content.guestbook.posted}
        </div>
      ) : null}

      <form
        action="/api/guestbook"
        method="post"
        className="grid gap-4 rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-600">
            {content.guestbook.name}
            <input
              name="name"
              required
              maxLength={40}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
            />
          </label>
          <div />
        </div>
        <label className="grid gap-2 text-sm text-slate-600">
          {content.guestbook.message}
          <textarea
            name="message"
            required
            minLength={3}
            rows={5}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
          />
        </label>
        <button className="justify-self-start rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
          {content.guestbook.submit}
        </button>
      </form>

      <div className="grid gap-4">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-3xl border border-black/10 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-950">{entry.name}</h3>
                <span className="text-xs text-slate-500">
                  {entry.createdAt.toLocaleDateString(locale === "en" ? "en-US" : "zh-CN")}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{entry.message}</p>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-black/10 bg-white/75 p-5 text-sm text-slate-600 backdrop-blur-xl">
            {content.common.emptyGuestbook}
          </div>
        )}
      </div>
    </div>
  );
}

export function AboutPageContent({ locale }: { locale: Locale }) {
  const content = getSiteContent(locale);

  return (
    <div className="grid gap-6">
      <SectionHeading
        kicker={content.about.kicker}
        title={content.about.title}
        description={content.about.description}
      />

      <div className="grid gap-4 rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <p className="text-sm leading-8 text-slate-700">{content.about.body1}</p>
        <p className="text-sm leading-8 text-slate-700">{content.about.body2}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {content.about.cards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-black/10 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl"
          >
            <p className="text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase">
              {card.title}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsPageContent({ locale }: { locale: Locale }) {
  const content = getSiteContent(locale);
  const projects = [...content.projects].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  return (
    <div className="grid gap-6">
      <SectionHeading
        kicker={content.home.latestProjectKicker}
        title={content.home.latestProjectTitle}
        description={content.home.latestProjectDescription}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            {...project}
            locale={locale}
            updatedLabel={content.common.updated}
          />
        ))}
      </div>
    </div>
  );
}

export function ReleaseNotesPageContent({ locale }: { locale: Locale }) {
  const content = getSiteContent(locale);

  return (
    <div className="grid gap-6">
      <SectionHeading
        kicker={locale === "zh" ? "更新日志" : "Release notes"}
        title={locale === "zh" ? "站点更新" : "What changed"}
        description={
          locale === "zh"
            ? "每次上线都保留一条简短记录。"
            : "Small, visible steps that keep the stack moving forward."
        }
      />
      <div className="grid gap-4">
        {content.releaseNotes.map((entry) => (
          <div
            key={entry.version}
            className="rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-950">{entry.version}</h3>
              <span className="text-sm text-slate-500">{entry.date}</span>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-slate-600">
              {entry.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ToolsPageContent({ locale }: { locale: Locale }) {
  const content = getSiteContent(locale);
  return (
    <div className="grid gap-6">
      <SectionHeading
        kicker={content.toolsPage.kicker}
        title={content.toolsPage.title}
        description={content.toolsPage.description}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {content.tools.map((tool) => (
          <div
            key={tool.title}
            className="rounded-3xl border border-black/10 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl"
          >
            <h3 className="text-lg font-semibold text-slate-950">{tool.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{tool.description}</p>
          </div>
        ))}
      </div>

      <ToolsClient copy={{ ...content.toolsPage, locale }} />
    </div>
  );
}

export async function StudioPageContent({
  searchParams,
  locale,
}: {
  searchParams: SearchParams;
  locale: Locale;
}) {
  const content = getSiteContent(locale);
  const params = await searchParams;
  const recentPosts = await listRecentPosts(5);

  const saved = typeof params.saved === "string" ? params.saved : "";
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <div className="grid gap-6">
      <SectionHeading
        kicker={content.admin.kicker}
        title={content.admin.title}
        description={content.admin.description}
      />

      {saved ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          {content.admin.saved}: {saved}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">
          {error}
        </div>
      ) : null}

      <form
        action="/api/admin/posts"
        method="post"
        encType="multipart/form-data"
        className="grid gap-4 rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-600">
            {content.admin.password}
            <input
              name="password"
              type="password"
              required
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            {content.admin.markdownFile}
            <input
              name="markdownFile"
              type="file"
              accept=".md,.markdown,text/markdown"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-white"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-slate-600">
          {content.admin.pasteMarkdown}
          <textarea
            name="markdown"
            rows={14}
            placeholder={content.admin.placeholder}
            className="rounded-3xl border border-black/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-300"
          />
        </label>

        <button className="justify-self-start rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
          {content.admin.submit}
        </button>
      </form>

      <div className="rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">{content.admin.recentPosts}</h2>
        <div className="mt-4 grid gap-3">
          {recentPosts.map((post) => (
            <div
              key={post.slug}
              className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium text-slate-950">{post.title}</p>
                <p className="text-sm text-slate-600">{post.description}</p>
              </div>
              <span className="text-xs text-slate-500">{post.slug}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
