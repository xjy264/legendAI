# XJY Stack

Personal technical stack for papers, projects, and long-term writing.

## Run locally

```bash
npm install
npm run db:push
npm run dev
```

## Content flow

- Public posts live in `content/posts/*.md`
- The Markdown file is the source of truth
- Prisma mirrors metadata into SQLite for fast indexing

## Hidden editor

- Open `/studio/xjy-7a9f`
- Enter the password `xjy12345`
- Upload Markdown or paste content into the textarea

## Deploy

- Set `DATABASE_URL=file:./data/site.db`
- Set `ADMIN_PASSWORD_HASH` to the SHA-256 hash of your editor password
- Build with `npm run build`
- Start with `npm run start`
