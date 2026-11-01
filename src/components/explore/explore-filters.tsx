"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { chipStyles } from "@/components/ui/button";
import {
  exploreHref,
  exploreSorts,
  isExploreSort,
  isNameLanguage,
  nameLanguages,
  type ExploreQuery,
  type ExploreSort,
  type NameLanguage,
} from "@/lib/explore-url";

export interface CategoryOption {
  value: string;
  label: string;
  count: number;
}

const selectStyles =
  "min-h-13.5 min-w-0 cursor-pointer appearance-none rounded-full border-[1.5px] border-line bg-paper bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230B3D27' stroke-width='2' fill='none'/%3E%3C/svg%3E\")] bg-[position:right_14px_center] bg-no-repeat pr-9.5 pl-4 text-body-sm font-semibold text-ink transition-[border-color,box-shadow] hover:border-[#cdbfa8] focus-visible:border-green focus-visible:shadow-[0_0_0_4px_rgba(14,90,56,0.14)] focus-visible:outline-none";

/**
 * Search, category, sort and name-language controls for /explore. Every change is written to the
 * URL, which the server page reads, so results are shareable and the back button works. Without
 * JavaScript the form still submits as a plain GET.
 */
export function ExploreFilters({
  q,
  category,
  sort,
  names,
  categories,
}: {
  q: string;
  category: string;
  sort: ExploreSort;
  names: NameLanguage;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(q);
  const [optionsOpen, setOptionsOpen] = useState(false);
  // When the URL's query changes from elsewhere (a suggestion chip, back button), follow it,
  // unless it's just our own debounced update catching up with what's being typed.
  const [seenQ, setSeenQ] = useState(q);
  if (q !== seenQ) {
    setSeenQ(q);
    if (q !== query.trim()) setQuery(q);
  }
  const debounce = useRef<number | undefined>(undefined);

  const current: ExploreQuery = { q, category, sort, names };

  function go(changes: Partial<ExploreQuery>) {
    // Any change of filter starts again from page 1.
    const href = exploreHref({ ...current, ...changes, page: 1 });
    startTransition(() => router.replace(href, { scroll: false }));
  }

  function onType(value: string) {
    setQuery(value);
    window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => go({ q: value.trim() }), 250);
  }

  useEffect(() => () => window.clearTimeout(debounce.current), []);

  const optionsChanged = sort !== "featured" || names !== "yoruba";

  return (
    <form
      action="/explore"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        window.clearTimeout(debounce.current);
        go({ q: query.trim() });
      }}
      className="mb-10 flex flex-col gap-4"
    >
      {category && <input type="hidden" name="category" value={category} />}

      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="group flex min-h-13 flex-1 items-center gap-2.5 rounded-full border-[1.5px] border-line bg-paper px-5 transition-[border-color,box-shadow] hover:border-[#cdbfa8] focus-within:border-green focus-within:shadow-[0_0_0_4px_rgba(14,90,56,0.14)] sm:min-h-13.5 sm:basis-80">
          <Search className="size-4.5 shrink-0 text-ink-secondary transition-colors group-focus-within:text-green" aria-hidden />
          <span className="sr-only">Search plants</span>
          <input
            type="search"
            name="q"
            autoComplete="off"
            value={query}
            onChange={(event) => onType(event.target.value)}
            placeholder="Search any name: ewuro, oji, Curcuma…"
            className="min-w-0 flex-1 bg-transparent text-[1.0625rem] text-ink caret-purple outline-none focus-visible:outline-none placeholder:text-ink-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                window.clearTimeout(debounce.current);
                go({ q: "" });
              }}
              aria-label="Clear search"
              className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-cream text-ink-secondary transition-colors hover:bg-green hover:text-paper"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          )}
        </label>

        {/* Phones: category dropdown plus a button that reveals sort and name language. */}
        <div className="flex gap-2.5 sm:hidden">
          <label className="sr-only" htmlFor="explore-category">
            Category
          </label>
          <select
            id="explore-category"
            value={category}
            onChange={(event) => go({ category: event.target.value })}
            className={`${selectStyles} min-h-13 flex-1`}
          >
            {categories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value ? option.label : "All categories"} ({option.count})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setOptionsOpen((open) => !open)}
            aria-expanded={optionsOpen}
            aria-controls="explore-options"
            aria-label="Sort and name language"
            className="relative inline-flex size-13 shrink-0 items-center justify-center rounded-full border-[1.5px] border-line bg-paper text-green transition-colors hover:border-green aria-expanded:border-green aria-expanded:bg-green aria-expanded:text-paper"
          >
            <SlidersHorizontal className="size-5" aria-hidden />
            {optionsChanged && (
              <span className="absolute top-2 right-2 size-2.25 rounded-full border-2 border-paper bg-purple" />
            )}
          </button>
        </div>

        <div
          id="explore-options"
          className={`${optionsOpen ? "grid animate-fade-up" : "hidden"} grid-cols-2 gap-2.5 sm:contents`}
        >
          <label className="sr-only" htmlFor="explore-sort">
            Sort
          </label>
          <select
            id="explore-sort"
            name="sort"
            value={sort}
            onChange={(event) => isExploreSort(event.target.value) && go({ sort: event.target.value })}
            className={`${selectStyles} max-sm:min-h-12 max-sm:text-[0.8125rem]`}
          >
            {Object.entries(exploreSorts).map(([value, label]) => (
              <option key={value} value={value}>
                Sort: {label}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="explore-names">
            Show names in
          </label>
          <select
            id="explore-names"
            name="names"
            value={names}
            onChange={(event) => isNameLanguage(event.target.value) && go({ names: event.target.value })}
            className={`${selectStyles} max-sm:min-h-12 max-sm:text-[0.8125rem]`}
          >
            {Object.entries(nameLanguages).map(([value, label]) => (
              <option key={value} value={value}>
                Names in {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Larger screens: category chips with counts for the current search. */}
      <nav aria-label="Categories" className="hidden flex-wrap justify-center gap-1.5 sm:flex">
        {categories.map((option) => (
          <Link
            key={option.value || "all"}
            href={exploreHref({ ...current, category: option.value, page: 1 })}
            scroll={false}
            aria-current={option.value === category ? "page" : undefined}
            className={`${chipStyles} flex-auto justify-center text-[0.8125rem]`}
          >
            {option.label} <span className="text-[0.6875rem] opacity-70">{option.count}</span>
          </Link>
        ))}
      </nav>
    </form>
  );
}
