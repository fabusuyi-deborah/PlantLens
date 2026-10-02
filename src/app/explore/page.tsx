import type { Metadata } from "next";
import Link from "next/link";
import { X } from "lucide-react";
import { CategoryTabs, QuickFilters } from "@/components/explore/category-tabs";
import { Pagination } from "@/components/explore/pagination";
import { NoResults, SearchHint } from "@/components/explore/search-feedback";
import { PlantCard } from "@/components/plant-card";
import { buttonStyles } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { categoryMeta } from "@/lib/categories";
import { exploreHref } from "@/lib/explore-url";
import { getAllPlants, getCategoryCounts, getPlantsByIds } from "@/lib/plants";
import { searchPlants } from "@/lib/search";
import type { PlantCategory } from "@/types/plant";

export const metadata: Metadata = {
  title: "Explore Plants · PlantLens",
  description: "Browse and search PlantLens's curated collection of Nigerian plants.",
};

const PAGE_SIZE = 8;
const suggestionIds = ["bitter-leaf", "moringa", "scent-leaf", "neem", "aloe-vera"];

function firstParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function isCategory(value: string): value is PlantCategory {
  return value in categoryMeta;
}

export default async function ExplorePage(props: PageProps<"/explore">) {
  const searchParams = await props.searchParams;
  const q = firstParam(searchParams.q);
  const categoryParam = firstParam(searchParams.category);
  const category = isCategory(categoryParam) ? categoryParam : undefined;

  const categories = getCategoryCounts().map((entry) => entry.category);
  const inCategory = getAllPlants().filter((plant) => !category || plant.category.includes(category));
  const results = searchPlants(inCategory, q);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(firstParam(searchParams.page)) || 1), pageCount);
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const suggestions = getPlantsByIds(suggestionIds);
  const resultIds = new Set(results.map((plant) => plant.id));
  const otherSuggestions = suggestions.filter((plant) => !resultIds.has(plant.id)).slice(0, 3);

  const isSearching = q !== "";
  const hasResults = results.length > 0;

  return (
    <main className="mx-auto max-w-336 px-4 pt-10 pb-16 md:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[2rem] leading-tight font-bold tracking-[-0.8px] text-ink sm:text-page-title">
            {isSearching ? (
              <>
                Results for <span className="text-accent">&quot;{q}&quot;</span>
              </>
            ) : (
              "Explore Plants"
            )}
          </h1>
          <p className="mt-1 text-[15px] text-ink-secondary">
            {isSearching
              ? `${results.length} ${results.length === 1 ? "plant matches" : "plants match"} your search`
              : "Browse our curated collection of Nigerian plants"}
          </p>
        </div>
        {isSearching ? (
          <Link href={exploreHref({ category })} className={buttonStyles({ variant: "secondary", size: "sm" })}>
            <X className="size-4" aria-hidden /> Clear search
          </Link>
        ) : (
          <p className="text-[15px] text-ink-tertiary">
            Showing {results.length} {results.length === 1 ? "plant" : "plants"}
          </p>
        )}
      </header>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row">
        <SearchInput
          size="md"
          defaultValue={q}
          category={category}
          clearHref={exploreHref({ category })}
          className="flex-1"
        />
        {hasResults && <QuickFilters categories={categories.slice(0, 2)} active={category} q={q} />}
      </div>

      <div className="mt-6">
        <CategoryTabs categories={categories} active={category} q={q} />
      </div>

      {hasResults ? (
        <>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pageResults.map((plant) => (
              <li key={plant.id}>
                <PlantCard plant={plant} />
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-6">
            <Pagination page={page} pageCount={pageCount} query={{ q, category }} />
            {isSearching && otherSuggestions.length > 0 && (
              <SearchHint suggestions={otherSuggestions.map((plant) => plant.name_common)} />
            )}
          </div>
        </>
      ) : (
        <NoResults
          query={q || (category ? categoryMeta[category].pluralLabel : "")}
          suggestions={suggestions.map((plant) => plant.name_common)}
        />
      )}
    </main>
  );
}
