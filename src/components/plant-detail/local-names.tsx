"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { roundButtonStyles } from "@/components/ui/button";
import { groupByRegion, languageRegion } from "@/lib/languages";
import { plural } from "@/lib/plant-text";

type LocalName = { language: string; name: string };

// The reader's chosen language, remembered across plants in this browser.
const STORAGE_KEY = "plantlens:name-language";
const CHANGE_EVENT = "plantlens:name-language-change";

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function store(language: string) {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function splitName(name: string) {
  const [main, ...alternates] = name
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  return { main, alternates };
}

/**
 * A plant's local names in a panel that stays the same size however many languages there are:
 * one name shown large, ‹ › arrows to step through the languages, and a full list (closed by
 * default) where any row switches the card. The chosen language is remembered, so a Hausa
 * reader sees Hausa names on every plant.
 */
export function LocalNames({ names }: { names: LocalName[] }) {
  const stored = useSyncExternalStore(subscribe, readStored, () => null);
  const [listOpen, setListOpen] = useState(false);
  const listId = useId();
  const current = names.find((entry) => entry.language === stored) ?? names[0];
  const { main, alternates } = splitName(current.name);
  const groups = groupByRegion(names);
  // Arrows step through languages in the list's order (region by region), wrapping round.
  const ordered = groups.flatMap((group) => group.entries);
  const position = ordered.findIndex((entry) => entry.language === current.language);
  const step = (by: 1 | -1) => store(ordered[(position + by + ordered.length) % ordered.length].language);
  const regionCount = groups.length;
  const several = ordered.length > 1;
  const arrow = `${roundButtonStyles} size-12 border-ink/20 bg-paper text-ink hover:border-ink hover:bg-ink hover:text-paper`;

  return (
    <div className="rounded-3xl bg-pink p-5 sm:p-8">
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-10">
        <div>
          <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight font-medium text-green">
            Local names
          </h2>
          <p className="mt-1 text-body-sm text-ink-secondary">
            Known in {plural(names.length, "language")}
            {regionCount > 1 && ` across ${plural(regionCount, "region")}`}
          </p>
          <p className="mt-4 mb-1.5 text-overline text-ink uppercase">Say it in</p>
          <div className="flex max-w-96 items-center gap-2">
            {several && (
              <button type="button" onClick={() => step(-1)} aria-label="Previous language" className={arrow}>
                <ChevronLeft className="size-5" aria-hidden />
              </button>
            )}
            <button
              type="button"
              onClick={() => several && setListOpen((open) => !open)}
              aria-expanded={several ? listOpen : undefined}
              aria-controls={several ? listId : undefined}
              aria-label={several ? `${current.language}. Show all languages` : undefined}
              className="flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-full bg-paper px-4 text-center transition-colors hover:bg-paper/80"
            >
              <span className="truncate font-semibold text-ink">{current.language}</span>
            </button>
            {several && (
              <button type="button" onClick={() => step(1)} aria-label="Next language" className={arrow}>
                <ChevronRight className="size-5" aria-hidden />
              </button>
            )}
          </div>
        </div>

        <div key={current.language} aria-live="polite" className="min-w-0 animate-fade-up">
          <p className="text-overline text-ink-secondary uppercase">
            {current.language} · {languageRegion(current.language)}
          </p>
          <p className="mt-1 font-display text-[clamp(2.5rem,6vw,5rem)] leading-none font-semibold tracking-[-0.03em] break-words text-green">
            {main}
          </p>
          {alternates.length > 0 && (
            <p className="mt-2 text-body text-ink-secondary">also {alternates.join(", ")}</p>
          )}
        </div>
      </div>

      {several && (
        <div className="mt-6 border-t border-ink/15 pt-4">
          <button
            type="button"
            onClick={() => setListOpen((open) => !open)}
            aria-expanded={listOpen}
            aria-controls={listId}
            className="inline-flex items-center gap-1.5 text-[0.8125rem] font-bold text-ink"
          >
            {listOpen ? "Hide names" : `See all ${names.length} names`}
            <ChevronDown className={`size-4 transition-transform ${listOpen ? "rotate-180" : ""}`} aria-hidden />
          </button>
          <div id={listId} hidden={!listOpen} className="mt-3 columns-1 gap-8 sm:columns-2 lg:columns-3">
            {groups.map(({ region, entries }) => (
              <section key={region} aria-label={region} className="mb-3">
                <h3 className="mb-1 break-after-avoid text-overline text-ink-secondary uppercase">{region}</h3>
                <ul>
                  {entries.map((entry) => {
                    const active = entry.language === current.language;
                    return (
                      <li key={entry.language} className="break-inside-avoid border-b border-ink/10">
                        <button
                          type="button"
                          onClick={() => store(entry.language)}
                          aria-pressed={active}
                          className={`flex w-full items-baseline gap-2 rounded-lg px-2 py-1.5 text-left text-body-sm transition-colors hover:bg-paper/60 ${
                            active ? "bg-paper" : ""
                          }`}
                        >
                          <span className="w-24 shrink-0 text-ink-secondary">{entry.language}</span>
                          <span className="min-w-0 font-semibold break-words">
                            {entry.name.split("/").map((part) => part.trim()).join(", ")}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
