import type { PlantCategory } from "@/types/plant";

export const exploreSorts = {
  featured: "Featured",
  az: "A to Z",
  compounds: "Most compounds",
  uses: "Most uses",
} as const;
export type ExploreSort = keyof typeof exploreSorts;

/**
 * Which language the result cards show local names in, as a key like "yoruba". The options come
 * from the data (see getNameLanguages); this is the one left out of URLs.
 */
export const DEFAULT_NAME_LANGUAGE = "yoruba";

export interface NameLanguageOption {
  value: string;
  label: string;
}

export interface ExploreQuery {
  q?: string;
  category?: PlantCategory | string;
  sort?: ExploreSort;
  names?: string;
  page?: number;
}

/** Builds an /explore URL, leaving out empty params and defaults (featured, Yoruba, page 1). */
export function exploreHref({ q, category, sort, names, page }: ExploreQuery = {}): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (sort && sort !== "featured") params.set("sort", sort);
  if (names && names !== DEFAULT_NAME_LANGUAGE) params.set("names", names);
  if (page && page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/explore?${search}` : "/explore";
}

export function isExploreSort(value: string): value is ExploreSort {
  return value in exploreSorts;
}
