"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { History, Search, X } from "lucide-react";
import { roundButtonStyles } from "@/components/ui/button";
import { exploreHref } from "@/lib/explore-url";
import { firstName } from "@/lib/plant-text";
import { describeMatch, searchPlants, type SearchablePlant } from "@/lib/search";

const RECENT_KEY = "plantlens:recent-searches";
const MAX_RESULTS = 6;
const MAX_RECENT = 3;
const POPULAR_IDS = ["bitter-leaf", "moringa", "scent-leaf", "neem"];

// Recent searches are a per-browser convenience, so storage failures are ignored.
function readRecent(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(stored) ? stored.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function saveRecent(term: string) {
  try {
    const next = [term, ...readRecent().filter((item) => item.toLowerCase() !== term.toLowerCase())];
    localStorage.setItem(RECENT_KEY, JSON.stringify(next.slice(0, MAX_RECENT)));
  } catch {}
}

/** A row in the list: a plant (with the label shown on its tag) or a recent search term. */
type Item = { kind: "plant"; plant: SearchablePlant; tag: string } | { kind: "recent"; term: string };

const optionId = (index: number) => `command-palette-option-${index}`;

/**
 * The ⌘K search dialog. With a query it lists matching plants and why each matched; empty, it
 * shows recent searches and popular plants. Arrow keys move, Enter opens, Escape closes.
 */
export function CommandPalette({
  plants,
  onClose,
}: {
  plants: SearchablePlant[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent] = useState(readRecent);

  const trimmed = query.trim();
  const results = useMemo(
    () => (trimmed ? searchPlants(plants, trimmed).slice(0, MAX_RESULTS) : []),
    [plants, trimmed],
  );
  const popular = useMemo(
    () =>
      POPULAR_IDS.map((id) => plants.find((plant) => plant.id === id)).filter(
        (plant): plant is SearchablePlant => plant !== undefined,
      ),
    [plants],
  );

  const recentItems: Item[] = recent.map((term) => ({ kind: "recent", term }));
  const items: Item[] = trimmed
    ? results.map((plant) => ({ kind: "plant", plant, tag: describeMatch(plant, trimmed) }))
    : [
        ...recentItems,
        ...popular.map((plant): Item => ({
          kind: "plant",
          plant,
          tag: firstName(plant.names_local[0]?.name),
        })),
      ];

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function updateQuery(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function select(item: Item | undefined) {
    if (item?.kind === "recent") {
      updateQuery(item.term);
      return;
    }
    if (item?.kind === "plant") {
      if (trimmed) saveRecent(trimmed);
      router.push(`/plants/${item.plant.id}`);
    } else if (trimmed) {
      saveRecent(trimmed);
      router.push(exploreHref({ q: trimmed }));
    } else {
      return;
    }
    onClose();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown" && items.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % items.length);
    } else if (event.key === "ArrowUp" && items.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + items.length) % items.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      // With a query but no matching plant, Enter searches the full explore page.
      select(trimmed && results.length === 0 ? undefined : items[activeIndex]);
    }
  }

  const optionProps = (index: number) => ({
    id: optionId(index),
    role: "option" as const,
    "aria-selected": index === activeIndex,
    onMouseMove: () => setActiveIndex(index),
    onClick: () => select(items[index]),
  });
  const rowStyle = (index: number) =>
    `cursor-pointer border-b border-line last:border-0 transition-colors ${
      index === activeIndex ? "bg-[#f1eafd]" : ""
    }`;

  // Portal to <body> so no ancestor's stacking context or transform can trap the fixed overlay.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/55 px-4 pt-[calc(10vh+env(safe-area-inset-top,0px))] pb-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search plants"
        className="w-full max-w-155 animate-fade-up rounded-3xl bg-purple p-5 text-paper shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-overline uppercase">Search any name, any language</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className={`${roundButtonStyles} size-10.5 hover:text-ink`}
          >
            <X className="size-4" strokeWidth={2.6} aria-hidden />
          </button>
        </div>

        <div className="flex min-h-14.5 items-center gap-2.5 rounded-full bg-paper px-5 text-ink transition-shadow focus-within:shadow-[0_0_0_4px_rgba(255,255,255,0.35)]">
          <Search className="size-5 shrink-0 text-green" aria-hidden />
          <input
            autoFocus
            type="search"
            role="combobox"
            aria-label="Search plants"
            aria-expanded={items.length > 0}
            aria-controls="command-palette-list"
            aria-activedescendant={items.length > 0 ? optionId(activeIndex) : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="ewuro, oji, zogale…"
            className="min-w-0 flex-1 bg-transparent text-[1.0625rem] caret-purple outline-none placeholder:text-ink-muted focus-visible:outline-none"
          />
        </div>

        <div className="mt-3.5 max-h-[52vh] overflow-y-auto rounded-[18px] bg-paper text-ink">
          <ul id="command-palette-list" role="listbox" aria-label="Search results">
            {trimmed && results.length === 0 && (
              <li role="presentation" className="px-4.5 py-4 text-ink-secondary">
                No plant called “{trimmed}” yet. Press Enter to search everything.
              </li>
            )}
            {!trimmed && recent.length > 0 && <SectionLabel>Recent searches</SectionLabel>}
            {items.map((item, index) => {
              if (item.kind === "recent") {
                return (
                  <li
                    key={`recent-${item.term}`}
                    {...optionProps(index)}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 ${rowStyle(index)}`}
                  >
                    <History className="size-4 shrink-0 text-ink-secondary" aria-hidden />
                    <span className="font-display text-base font-medium">{item.term}</span>
                  </li>
                );
              }
              const { plant, tag } = item;
              return (
                <Fragment key={plant.id}>
                  {!trimmed && index === recentItems.length && <SectionLabel>Popular</SectionLabel>}
                  <PlantRow plant={plant} tag={tag} className={rowStyle(index)} {...optionProps(index)} />
                </Fragment>
              );
            })}
          </ul>
        </div>

        <p className="mt-3 hidden flex-wrap gap-x-4 gap-y-1.5 text-xs opacity-85 sm:flex">
          <Hint keys={["↑", "↓"]} label="to move" />
          <Hint keys={["Enter"]} label="to open" />
          <Hint keys={["Esc"]} label="to close" />
        </p>
      </div>
    </div>,
    document.body,
  );
}

function PlantRow({
  plant,
  tag,
  className,
  ...rest
}: {
  plant: SearchablePlant;
  tag: string;
  className: string;
} & React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li {...rest} className={`grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3.5 px-3.5 py-2.5 ${className}`}>
      <span className="relative size-13 overflow-hidden rounded-xl bg-line">
        {plant.photo_url && <Image src={plant.photo_url} alt="" fill sizes="52px" className="object-cover" />}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-[1.0625rem] font-medium">{plant.name_common}</span>
        <span className="block truncate text-body-sm text-ink-secondary italic">{plant.name_scientific}</span>
      </span>
      {tag && (
        <span className="hidden rounded-full bg-pink px-2.5 py-1 text-[0.65625rem] font-bold tracking-[0.08em] uppercase sm:inline">
          {tag}
        </span>
      )}
    </li>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <li role="presentation" className="px-3.5 pt-3 pb-1 text-overline text-ink-secondary uppercase">
      {children}
    </li>
  );
}

function Hint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span>
      {keys.map((key) => (
        <kbd key={key} className="mr-0.75 rounded-[5px] bg-paper/18 px-1.5 py-px font-sans text-[0.6875rem] font-semibold">
          {key}
        </kbd>
      ))}{" "}
      {label}
    </span>
  );
}
