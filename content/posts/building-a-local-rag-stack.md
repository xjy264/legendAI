---
slug: building-a-local-rag-stack
title: Building a Local RAG Stack
description: A project note on turning papers into searchable context for future writing.
tags: [project, rag, retrieval, notes]
category: project
status: published
featured: true
publishedAt: 2024-08-24
---

This project started as a way to avoid rereading the same papers every time I had a new idea.

The stack is intentionally small:

- Markdown files hold the original notes.
- SQLite stores the searchable index.
- The site reads both so the raw content never disappears.

That split is useful because I can keep writing in Markdown while still building a better surface for browsing. It also makes backfilling older notes easier. I can drop an old file into the content folder, run the sync, and the public archive catches up.

The best part is that the system stays boring in the right way. I do not need a separate CMS, and I do not need to migrate my whole archive before adding the next idea.
