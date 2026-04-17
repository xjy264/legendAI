# XJY Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a runnable personal stack with public pages, Markdown ingestion, hidden admin submission, and deployable SQLite persistence.

**Architecture:** Keep Markdown as the source of truth and Prisma as the query index. Public pages read the synced archive, while the hidden editor writes files and updates the index through a server route.

**Tech Stack:** Next.js App Router, Prisma 7, SQLite, Tailwind CSS, React Markdown.

---

### Task 1: Scaffold app shell and visual system

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `src/components/site-shell.tsx`
- Create: `src/components/section-heading.tsx`

- [ ] **Step 1: Replace the default shell with the editorial layout**
- [ ] **Step 2: Add the background, typography, and card styling**
- [ ] **Step 3: Verify the root layout renders with the new shell**

### Task 2: Build content and persistence layer

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma.config.ts`
- Create: `src/lib/prisma.ts`
- Create: `src/lib/content.ts`
- Create: `src/lib/guestbook.ts`
- Create: `src/lib/auth.ts`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Define the Post and GuestbookEntry models**
- [ ] **Step 2: Implement Markdown sync and Prisma upsert logic**
- [ ] **Step 3: Implement password verification and helper utilities**

### Task 3: Build public pages

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/articles/page.tsx`
- Create: `src/app/articles/[slug]/page.tsx`
- Create: `src/app/projects/page.tsx`
- Create: `src/app/tools/page.tsx`
- Create: `src/app/guestbook/page.tsx`
- Create: `src/app/about/page.tsx`
- Create: `src/app/release-notes/page.tsx`
- Create: `src/components/cards.tsx`
- Create: `src/components/markdown.tsx`
- Create: `src/components/tools-client.tsx`

- [ ] **Step 1: Render the home page with the full stack layout**
- [ ] **Step 2: Render article archive and detail pages**
- [ ] **Step 3: Render projects, tools, guestbook, and informational pages**

### Task 4: Build hidden submission flow

**Files:**
- Create: `src/app/studio/xjy-7a9f/page.tsx`
- Create: `src/app/api/admin/posts/route.ts`
- Create: `src/app/api/guestbook/route.ts`

- [ ] **Step 1: Add the hidden Markdown submission form**
- [ ] **Step 2: Add server-side password validation**
- [ ] **Step 3: Write uploaded Markdown to disk and update the index**

### Task 5: Add SEO and deployability

**Files:**
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/app/not-found.tsx`
- Update: `README.md`

- [ ] **Step 1: Add sitemap and robots metadata**
- [ ] **Step 2: Add a styled not-found page**
- [ ] **Step 3: Document local run and deployment steps**

