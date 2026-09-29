export interface ExploreQuery {
  q?: string;
  category?: string;
  page?: number;
}

/** Builds an /explore URL, leaving out empty params and page 1. */
export function exploreHref({ q, category, page }: ExploreQuery = {}): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (page && page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/explore?${search}` : "/explore";
}
