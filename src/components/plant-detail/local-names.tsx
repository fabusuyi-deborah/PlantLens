"use client";

import { useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import { selectStyles } from "@/components/ui/select";
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
 * one name shown large, a language picker grouped by region, and an "all names" list that's
 * closed by default. The picked language is remembered, so a Hausa reader sees Hausa names
 * on every plant.
 */
export function LocalNames({ names }: { names: LocalName[] }) {
  const stored = useSyncExternalStore(subscribe, readStored, () => null);
  const current = names.find((entry) => entry.language === stored) ?? names[0];
  const { main, alternates } = splitName(current.name);
  const groups = groupByRegion(names);
  const regionCount = groups.length;

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
          <label htmlFor="name-language" className="mt-4 mb-1.5 block text-overline text-ink uppercase">
            Say it in
          </label>
          <select
            id="name-language"
            value={current.language}
            onChange={(event) => store(event.target.value)}
            className={`${selectStyles} w-full max-w-80 border-ink/20`}
          >
            {groups.map(({ region, entries }) => (
              <optgroup key={region} label={region}>
                {entries.map((entry) => (
                  <option key={entry.language} value={entry.language}>
                    {entry.language}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
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

      {names.length > 1 && (
        <details className="group mt-6 border-t border-ink/15 pt-4">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[0.8125rem] font-bold text-ink [&::-webkit-details-marker]:hidden">
            See all {names.length} names
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="mt-3 columns-1 gap-8 sm:columns-2 lg:columns-3">
            {groups.map(({ region, entries }) => (
              <section key={region} aria-label={region} className="mb-3">
                <h3 className="mb-1 break-after-avoid text-overline text-ink-secondary uppercase">{region}</h3>
                <dl>
                  {entries.map((entry) => (
                    <div key={entry.language} className="flex break-inside-avoid items-baseline gap-2 border-b border-ink/10 py-1.5 text-body-sm">
                      <dt className="w-24 shrink-0 text-ink-secondary">{entry.language}</dt>
                      <dd className="min-w-0 font-semibold break-words">{entry.name.split("/").map((p) => p.trim()).join(", ")}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
