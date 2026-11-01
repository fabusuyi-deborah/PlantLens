import type { PlantCategory } from "@/types/plant";

export const exploreSorts = {
  featured: "Featured",
  az: "A to Z",
  compounds: "Most compounds",
  uses: "Most uses",
} as const;
export type ExploreSort = keyof typeof exploreSorts;

/** Which local name the result cards show. */
export const nameLanguages = { yoruba: "Yoruba", igbo: "Igbo", hausa: "Hausa" } as const;
export type NameLanguage = keyof typeof nameLanguages;

export interface ExploreQuery {
  q?: string;
  category?: PlantCategory | string;
  sort?: ExploreSort;
  names?: NameLanguage;
  page?: number;
}

/** Builds an /explore URL, leaving out empty params and defaults (featured, Yoruba, page 1). */
export function exploreHref({ q, category, sort, names, page }: ExploreQuery = {}): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (sort && sort !== "featured") params.set("sort", sort);
  if (names && names !== "yoruba") params.set("names", names);
  if (page && page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/explore?${search}` : "/explore";
}

export function isExploreSort(value: string): value is ExploreSort {
  return value in exploreSorts;
}

export function isNameLanguage(value: string): value is NameLanguage {
  return value in nameLanguages;
}
