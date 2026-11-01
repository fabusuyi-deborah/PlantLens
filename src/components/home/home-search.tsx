"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { exploreHref } from "@/lib/explore-url";
import { describeMatch, searchPlants, type SearchablePlant } from "@/lib/search";

/**
 * Search field with live results as you type. Submitting (Enter or the button) opens the full
 * results on /explore. `onDark` styles it for the purple band.
 */
export function HomeSearch({
  plants,
  label,
  placeholder,
  tryTerms,
  onDark = false,
}: {
  plants: SearchablePlant[];
  label: string;
  placeholder: string;
  /** Example searches shown as chips under the field. */
  tryTerms?: string[];
  onDark?: boolean;
}) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const resultsId = useId();
  const trimmed = query.trim();
  const results = useMemo(() => (trimmed ? searchPlants(plants, trimmed).slice(0, 6) : []), [plants, trimmed]);

  return (
    <div className="w-full">
      <form action="/explore" role="search">
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <div
          className={`flex min-h-14.5 items-center gap-2.5 rounded-full bg-paper py-1.5 pr-2 pl-5 text-ink transition-shadow ${
            onDark
              ? "focus-within:shadow-[0_0_0_4px_rgba(255,255,255,0.35)]"
              : "border-[1.5px] border-green shadow-[0_2px_0_var(--color-green)] focus-within:shadow-[0_2px_0_var(--color-green),0_0_0_4px_rgba(14,90,56,0.14)]"
          }`}
        >
          <Search className="size-5 shrink-0 text-green" aria-hidden />
          <input
            id={inputId}
            type="search"
            name="q"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            aria-controls={resultsId}
            className="min-w-0 flex-1 bg-transparent text-[1.0625rem] caret-purple outline-none placeholder:text-ink-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-cream text-ink-secondary transition-colors hover:bg-green hover:text-paper"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
          <button
            type="submit"
            className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-yellow px-5.5 text-caption font-bold tracking-[0.14em] text-ink uppercase transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-pink"
          >
            Search
          </button>
        </div>
      </form>

      {tryTerms && (
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[0.8125rem] opacity-80">Try</span>
          {tryTerms.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="min-h-8.5 rounded-full border-[1.5px] border-paper/50 px-3.5 text-body-sm font-semibold text-paper transition-colors hover:bg-paper hover:text-purple"
            >
              {term}
            </button>
          ))}
        </div>
      )}

      <div id={resultsId} aria-live="polite">
        {trimmed && (
          <div
            className={`mt-3.5 overflow-hidden rounded-[18px] bg-paper text-left text-ink ${
              onDark ? "" : "border-[1.5px] border-line"
            }`}
          >
            {results.length === 0 ? (
              <p className="px-4.5 py-4 text-ink-secondary">
                No plant called “{trimmed}” yet. Try another spelling, or{" "}
                <Link href="/explore" className="underline underline-offset-2">
                  browse all {plants.length}
                </Link>
                .
              </p>
            ) : (
              <ul>
                {results.map((plant) => (
                  <li key={plant.id} className="border-b border-line last:border-0">
                    <Link
                      href={`/plants/${plant.id}`}
                      className="grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3.5 px-3.5 py-2.5 transition-colors hover:bg-[#fbf4ff]"
                    >
                      <span className="relative size-13 overflow-hidden rounded-xl bg-line">
                        {plant.photo_url && (
                          <Image src={plant.photo_url} alt="" fill sizes="52px" className="object-cover" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-display text-[1.0625rem] font-medium">
                          {plant.name_common}
                        </span>
                        <span className="block truncate text-body-sm text-ink-secondary italic">
                          {plant.name_scientific}
                        </span>
                      </span>
                      <span className="hidden rounded-full bg-pink px-2.5 py-1 text-[0.65625rem] font-bold tracking-[0.08em] uppercase sm:inline">
                        {describeMatch(plant, trimmed)}
                      </span>
                    </Link>
                  </li>
                ))}
                {results.length > 0 && (
                  <li>
                    <Link
                      href={exploreHref({ q: trimmed })}
                      className="block px-4.5 py-3 text-caption font-bold tracking-[0.12em] text-green uppercase hover:bg-[#fbf4ff]"
                    >
                      See all results →
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
