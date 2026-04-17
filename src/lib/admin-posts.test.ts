import { strict as assert } from "node:assert";
import { test } from "node:test";

import { buildAdminPostList } from "./admin-posts";

type PostLike = {
  slug: string;
  title: string;
  publishedAt: Date;
};

test("buildAdminPostList filters titles with fuzzy search and sorts by publishedAt descending", () => {
  const posts: PostLike[] = [
    { slug: "dlinear", title: "DLinear：一个很干净的基线", publishedAt: new Date("2026-01-01") },
    { slug: "timesnet", title: "TimesNet：把时间序列翻成二维再看一遍", publishedAt: new Date("2025-09-20") },
    { slug: "informer", title: "Informer：长序列预测里的一个折中方案", publishedAt: new Date("2025-10-01") },
  ];

  const fuzzy = buildAdminPostList(posts, { query: "times net", page: 1, pageSize: 5 });
  assert.deepEqual(fuzzy.posts.map((post) => post.slug), ["timesnet"]);

  const sorted = buildAdminPostList(posts, { query: "", page: 1, pageSize: 5 });
  assert.deepEqual(sorted.posts.map((post) => post.slug), ["dlinear", "informer", "timesnet"]);
});

test("buildAdminPostList clamps pagination to the last page", () => {
  const posts: PostLike[] = [
    { slug: "dlinear", title: "DLinear：一个很干净的基线", publishedAt: new Date("2026-01-01") },
    { slug: "informer", title: "Informer：长序列预测里的一个折中方案", publishedAt: new Date("2025-10-01") },
    { slug: "timesnet", title: "TimesNet：把时间序列翻成二维再看一遍", publishedAt: new Date("2025-09-20") },
  ];

  const result = buildAdminPostList(posts, { query: "", page: 99, pageSize: 2 });

  assert.equal(result.page, 2);
  assert.equal(result.totalPages, 2);
  assert.deepEqual(result.posts.map((post) => post.slug), ["timesnet"]);
});
