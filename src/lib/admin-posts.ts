type AdminPostListOptions = {
  query: string;
  page: number;
  pageSize: number;
};

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function matchesQuery<T extends { slug: string; title: string }>(post: T, query: string) {
  const needle = normalizeSearchText(query);
  if (!needle) {
    return true;
  }

  const haystack = normalizeSearchText(`${post.title} ${post.slug}`);
  return haystack.includes(needle);
}

function comparePublishedAt<T extends { slug: string; publishedAt: Date }>(left: T, right: T) {
  const timeDelta = right.publishedAt.getTime() - left.publishedAt.getTime();
  if (timeDelta !== 0) {
    return timeDelta;
  }

  return right.slug.localeCompare(left.slug);
}

export function buildAdminPostList<T extends { slug: string; title: string; publishedAt: Date }>(
  posts: T[],
  options: AdminPostListOptions,
) {
  const pageSize = Math.max(1, Math.floor(options.pageSize));
  const filtered = posts.filter((post) => matchesQuery(post, options.query)).sort(comparePublishedAt);
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const page = Math.min(Math.max(1, Math.floor(options.page) || 1), totalPages);
  const start = (page - 1) * pageSize;

  return {
    posts: filtered.slice(start, start + pageSize),
    page,
    pageSize,
    totalCount,
    totalPages,
  };
}
