"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { chipStyles } from "@/components/ui/button";
import { selectStyles } from "@/components/ui/select";
import { groupByRegion, languageRegion } from "@/lib/languages";
import { plural } from "@/lib/plant-text";
import type { ProfileCaution, ProfileCompound, ProfileUse } from "@/lib/plant-profile";
import { CitedText, useOpenCitation } from "./citations";
import { SeverityPill } from "./severity";

/**
 * Above COLLAPSE_AT names the panel shows the first VISIBLE and a "Show all" button (hiding only one
 * or two isn't worth a click); above FILTER_AT it also gets a filter box.
 */
const VISIBLE = 8;
const COLLAPSE_AT = 10;
const FILTER_AT = 12;

/**
 * Every local name for the plant at once, grouped by region, so readers can scan for their own
 * language instead of clicking through them. Alternatives ("Aki ilu / Aku inu") sit under the
 * main name. Long lists collapse, and very long ones get a filter.
 */
export function LocalNames({ names }: { names: { language: string; name: string }[] }) {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState("");
  const normalized = filter.trim().toLowerCase();
  const matching = normalized
    ? names.filter((entry) => `${entry.language} ${entry.name}`.toLowerCase().includes(normalized))
    : names;
  const collapsible = names.length > COLLAPSE_AT && !normalized;
  const shown = collapsible && !expanded ? matching.slice(0, VISIBLE) : matching;
  const groups = groupByRegion(shown);
  const languageCount = new Set(names.map((entry) => entry.language)).size;
  const regionCount = new Set(names.map((entry) => languageRegion(entry.language))).size;

  return (
    <div className="rounded-3xl bg-pink p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight font-medium text-green">
            Local names
          </h2>
          <p className="mt-1 text-body-sm text-ink-secondary">
            In {plural(languageCount, "language")}
            {regionCount > 1 && ` across ${plural(regionCount, "region")}`}
          </p>
        </div>
        {names.length > FILTER_AT && (
          <label className="flex min-h-11 w-full items-center gap-2 rounded-full bg-paper px-4 sm:w-64">
            <Search className="size-4 shrink-0 text-ink-secondary" aria-hidden />
            <span className="sr-only">Find a language</span>
            <input
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Find a language…"
              className="min-w-0 flex-1 bg-transparent text-body-sm outline-none focus-visible:outline-none"
            />
          </label>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {groups.map(({ region, entries }) => (
          <section key={region} aria-label={region}>
            <h3 className="mb-2 text-overline text-ink uppercase">{region}</h3>
            <dl className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
              {entries.map(({ language, name }) => {
                const [main, ...alternates] = name.split("/").map((part) => part.trim()).filter(Boolean);
                return (
                  <div key={language} className="flex min-w-0 flex-col gap-0.5 rounded-2xl bg-paper/70 px-3 py-3 sm:px-4">
                    <dt className="text-[0.6875rem] font-bold tracking-[0.1em] text-ink-secondary uppercase">
                      {language}
                    </dt>
                    <dd className="min-w-0">
                      <span className="block font-display text-lg leading-tight font-medium break-words text-green sm:text-2xl">
                        {main}
                      </span>
                      {alternates.length > 0 && (
                        <span className="mt-0.5 block text-body-sm break-words text-ink-secondary">
                          also {alternates.join(", ")}
                        </span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
        {normalized && matching.length === 0 && (
          <p className="text-ink-secondary">No language matching “{filter.trim()}” for this plant yet.</p>
        )}
      </div>

      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          className="mt-5 inline-flex min-h-10 items-center gap-1.5 rounded-full border-[1.5px] border-ink px-4 text-[0.8125rem] font-bold text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          {expanded ? "Show fewer" : `Show all ${names.length} names`}
          <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
        </button>
      )}
    </div>
  );
}

const regionTag = (region: string) =>
  region === "Nigeria" ? "bg-pink" : region === "General" ? "bg-yellow" : "bg-lavender";

/** Traditional uses, filterable by where they were recorded when there's more than one place. */
export function UsesList({ uses, sources }: { uses: ProfileUse[]; sources: string[] }) {
  const [region, setRegion] = useState("All");
  const regions = ["All", ...new Set(uses.map((use) => use.region))];
  const shown = uses.filter((use) => region === "All" || use.region === region);
  const filterable = regions.length > 2;

  if (uses.length === 0) return <EmptyNote>No traditional uses recorded in our sources yet.</EmptyNote>;

  return (
    <>
      {filterable && (
        <>
          <div className="mb-2.5 sm:hidden">
            <label htmlFor="region-select" className="sr-only">
              Where recorded
            </label>
            <select
              id="region-select"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className={`${selectStyles} min-h-12 w-full`}
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r === "All" ? "All regions" : r} (
                  {r === "All" ? uses.length : uses.filter((use) => use.region === r).length})
                </option>
              ))}
            </select>
          </div>
          <div role="group" aria-label="Where recorded" className="mb-2.5 hidden flex-wrap gap-1.5 sm:flex">
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={r === region}
                onClick={() => setRegion(r)}
                className={`${chipStyles} text-[0.8125rem]`}
              >
                {r}
              </button>
            ))}
          </div>
        </>
      )}
      <ul>
        {shown.map((use) => (
          <li
            key={use.key}
            className="grid gap-2 border-b border-line py-4.5 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-5"
          >
            <span>
              <span
                className={`inline-flex min-h-5.5 items-center rounded-full px-2.5 py-0.5 text-[0.65625rem] leading-tight font-bold tracking-[0.08em] uppercase ${regionTag(use.region)}`}
              >
                {use.region}
              </span>
            </span>
            <CitedText id={use.key} refNumber={use.ref} source={sources[use.ref - 1]} className="text-lg">
              {use.text}
            </CitedText>
          </li>
        ))}
      </ul>
    </>
  );
}

const compoundTiles = ["bg-lavender", "bg-orange", "bg-yellow", "bg-pink", "bg-mint"];

/** Compound tiles that open to show what each compound is associated with, and its source. */
export function CompoundGrid({ compounds, sources }: { compounds: ProfileCompound[]; sources: string[] }) {
  const { openKey, toggle } = useOpenCitation();
  if (compounds.length === 0) return <EmptyNote>No phytochemicals recorded in our sources yet.</EmptyNote>;
  return (
    <ul className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {compounds.map((compound, i) => {
        const open = openKey === compound.key;
        return (
          <li key={compound.key}>
            <button
              type="button"
              onClick={() => toggle(compound.key, compound.ref)}
              aria-expanded={open}
              className={`flex w-full flex-col gap-2.5 rounded-[20px] p-5.5 text-left text-ink transition-[transform,box-shadow] duration-250 hover:-translate-y-0.75 hover:-rotate-[0.5deg] hover:shadow-[0_18px_30px_-20px_rgba(11,61,39,0.5)] ${compoundTiles[i % compoundTiles.length]}`}
            >
              {compound.compoundClass && (
                <span className="inline-flex min-h-5.5 items-center self-start rounded-full bg-paper/60 px-2.5 text-[0.65625rem] font-bold tracking-[0.08em] uppercase">
                  {compound.compoundClass}
                </span>
              )}
              <span className="font-display text-[1.375rem] leading-[1.1] font-medium">{compound.name}</span>
              {open ? (
                <>
                  <span className="animate-fade-up text-[0.9375rem]">{compound.text}</span>
                  <span className="animate-fade-up text-[0.8125rem] font-bold">
                    [{compound.ref}] {sources[compound.ref - 1]}
                  </span>
                </>
              ) : (
                <span className="text-caption font-bold tracking-widest uppercase">Read more +</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}


export function CautionList({ cautions, sources }: { cautions: ProfileCaution[]; sources: string[] }) {
  if (cautions.length === 0) {
    return (
      <EmptyNote>
        No cautions recorded in our sources yet. That is not the same as safe: ask a healthcare
        professional.
      </EmptyNote>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {cautions.map((caution) => (
        <li
          key={caution.key}
          className="grid items-start gap-2 rounded-[20px] border border-line bg-paper p-5.5 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-5"
        >
          <div>
            <SeverityPill severity={caution.severity} />
          </div>
          <CitedText id={caution.key} refNumber={caution.ref} source={sources[caution.ref - 1]} className="text-lg">
            {caution.text}
          </CitedText>
        </li>
      ))}
    </ul>
  );
}

/** Numbered sources; the one behind the open citation is highlighted. */
export function SourceList({ sources }: { sources: string[] }) {
  const { openRef } = useOpenCitation();
  return (
    <ol className="grid gap-x-6 gap-y-2 md:grid-cols-2">
      {sources.map((source, i) => {
        const active = openRef === i + 1;
        return (
          <li
            key={source}
            className={`flex items-baseline gap-3 rounded-xl px-3 py-2.5 transition-colors duration-250 ${
              active ? "bg-lavender text-ink" : ""
            }`}
          >
            <span className={`min-w-5.5 font-display font-semibold ${active ? "text-purple" : "text-yellow"}`}>
              {i + 1}
            </span>
            <span className="min-w-0 break-words">{source}</span>
          </li>
        );
      })}
    </ol>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="rounded-[18px] border border-line bg-paper p-5.5 text-ink-secondary">{children}</p>;
}
