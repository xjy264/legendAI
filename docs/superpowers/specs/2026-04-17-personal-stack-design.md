# XJY Stack Design

**Goal:** Build a Lovstudio-inspired personal stack site for papers, projects, and long-term writing, with a hidden Markdown submission flow.

**Architecture:** Next.js App Router serves public pages, a hidden admin intake, and route handlers. Markdown files under `content/posts` are the source of truth; Prisma mirrors metadata into SQLite for fast archive queries. The UI uses a refined editorial layout with cards, strong typography, and a utility desk.

**Tech Stack:** Next.js 16, React 19, Prisma 7, SQLite, Markdown, Tailwind CSS.

---

## Public Surface

- Home page with hero, stats, featured articles, project wall, tools, and guestbook preview.
- Article archive and detail pages.
- Projects, tools, about, release notes, and guestbook pages.

## Private Surface

- Hidden editor at `/studio/xjy-7a9f`.
- Password validation occurs on the server.
- Markdown upload or paste writes the file to disk and updates the database index.

## Content Model

- `content/posts/*.md` stores full Markdown documents.
- Prisma `Post` stores slug, title, description, tags, category, status, featured, publish date, and file path.
- Prisma `GuestbookEntry` stores public notes.

