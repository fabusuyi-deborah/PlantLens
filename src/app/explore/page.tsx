import type { Metadata } from "next";
import Link from "next/link";
import { ExploreCard } from "@/components/explore/explore-card";
import { ExploreFilters, type CategoryOption } from "@/components/explore/explore-filters";
import { Pagination } from "@/components/explore/pagination";
import { NoResults, SearchHint } from "@/components/explore/search-feedback";
import { categoryMeta } from "@/lib/categories";
import { DEFAULT_NAME_LANGUAGE, exploreHref, isExploreSort, type ExploreSort } from "@/lib/explore-url";
import { getAllPlants, getCategoryCounts, getNameLanguages } from "@/lib/plants";
import { plural } from "@/lib/plant-text";
import { searchPlants } from "@/lib/search";
import type { Plant, PlantCategory } from "@/types/plant";

export const metadata: Metadata = {
  title: "All Plants · PlantLens",
  description: "Browse and search PlantLens's curated collection of African plants.",
};

const PAGE_SIZE = 9;

function firstParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function isCategory(value: string): value is PlantCategory {
  return value in categoryMeta;
}

/** Sorts a copy of the list. "Featured" keeps search relevance, or the curated order when browsing. */
function sortPlants(plants: Plant[], sort: ExploreSort): Plant[] {
  const order = new Map(getAllPlants().map((plant, i) => [plant.id, i]));
  const byOrder = (a: Plant, b: Plant) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0);
  const list = [...plants];
  if (sort === "az") list.sort((a, b) => a.name_common.localeCompare(b.name_common));
  if (sort === "compounds")
    list.sort((a, b) => (b.phytochemicals?.length ?? 0) - (a.phytochemicals?.length ?? 0) || byOrder(a, b));
  if (sort === "uses")
    list.sort((a, b) => b.traditional_uses.length - a.traditional_uses.length || byOrder(a, b));
  return list;
}

export default async function ExplorePage(props: PageProps<"/explore">) {
  const searchParams = await props.searchParams;
  const q = firstParam(searchParams.q);
  const categoryParam = firstParam(searchParams.category);
  const category = isCategory(categoryParam) ? categoryParam : undefined;
  const sortParam = firstParam(searchParams.sort);
  const sort = isExploreSort(sortParam) ? sortParam : "featured";
  const namesParam = firstParam(searchParams.names);
  const nameOptions = getNameLanguages();
  const names = nameOptions.some((option) => option.value === namesParam)
    ? namesParam
    : DEFAULT_NAME_LANGUAGE;
  const namesLabel = nameOptions.find((option) => option.value === names)?.label ?? names;

  const allPlants = getAllPlants();
  const matching = searchPlants(allPlants, q);
  const results = sortPlants(
    matching.filter((plant) => !category || plant.category.includes(category)),
    sort,
  );

  // Chip counts reflect the current search, so people can see where their matches are.
  const categoryOptions: CategoryOption[] = [
    { value: "", label: "All", count: matching.length },
    ...getCategoryCounts().map(({ category: value }) => ({
      value,
      label: categoryMeta[value].pluralLabel,
      count: matching.filter((plant) => plant.category.includes(value)).length,
    })),
  ];

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(firstParam(searchParams.page)) || 1), pageCount);
  const first = (page - 1) * PAGE_SIZE;
  const pageResults = results.slice(first, first + PAGE_SIZE);
  const filtered = q !== "" || category !== undefined;
  const query = { q, category, sort, names };

  return (
    <main className="mx-auto max-w-300 px-4 pt-12 pb-18 md:px-8">
      <header className="mb-9 flex flex-col items-center gap-1.5 text-center">
        <h1 className="font-display text-[clamp(1.75rem,3.6vw,2.625rem)] leading-[1.08] font-medium tracking-[-0.02em] text-green">
          All Plants
        </h1>
        <p className="text-body text-ink-secondary">
          {allPlants.length} African plants with local names, documented uses and the compounds behind
          them.
        </p>
      </header>

      <ExploreFilters
        q={q}
        category={category ?? ""}
        sort={sort}
        names={names}
        nameOptions={nameOptions}
        categories={categoryOptions}
      />

      <section aria-label="Results">
        {results.length === 0 ? (
          <NoResults query={q} inCategory={category !== undefined} />
        ) : (
          <>
            <ul className="grid gap-3.5 sm:grid-cols-2 sm:gap-x-5.5 sm:gap-y-8 lg:grid-cols-3">
              {pageResults.map((plant, i) => (
                <li key={plant.id}>
                  <ExploreCard plant={plant} names={names} namesLabel={namesLabel} index={i} />
                </li>
              ))}
            </ul>
            <Pagination page={page} pageCount={pageCount} query={query} />
            <p aria-live="polite" className="mt-5 text-center text-body-sm text-ink-secondary">
              Showing {first + 1}–{first + pageResults.length} of {plural(results.length, "plant")}
              {filtered && (
                <>
                  {" · "}
                  <Link
                    href={exploreHref({ sort, names })}
                    scroll={false}
                    className="font-semibold text-purple underline underline-offset-2"
                  >
                    Clear filters
                  </Link>
                </>
              )}
            </p>
            <SearchHint />
          </>
        )}
      </section>
    </main>
  );
}
