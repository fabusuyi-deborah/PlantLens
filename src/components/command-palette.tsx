"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, History, Leaf, Search } from "lucide-react";
import { CategoryPill } from "@/components/ui/category-pill";
import { exploreHref } from "@/lib/explore-url";
import { searchPlants, type SearchablePlant } from "@/lib/search";

const RECENT_KEY = "plantlens:recent-searches";
const MAX_RESULTS = 6;
const MAX_RECENT = 3;

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

type Item = { kind: "plant"; plant: SearchablePlant } | { kind: "recent"; term: string };

const optionId = (index: number) => `command-palette-option-${index}`;

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
  const items: Item[] = [
    ...results.map((plant) => ({ kind: "plant" as const, plant })),
    ...recent.map((term) => ({ kind: "recent" as const, term })),
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
      saveRecent(item.plant.name_common);
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
      // With no matching plant, Enter searches the full explore page.
      select(results.length > 0 ? items[activeIndex] : undefined);
    }
  }

  const optionProps = (index: number) => ({
    id: optionId(index),
    role: "option" as const,
    "aria-selected": index === activeIndex,
    onMouseMove: () => setActiveIndex(index),
    onClick: () => select(items[index]),
  });
  const activeStyle = (index: number) =>
    index === activeIndex ? "bg-accent-light shadow-[inset_3px_0_0_var(--color-accent)]" : "";

  // Portal to <body>: the navbar's backdrop-blur would otherwise trap this fixed overlay.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/30 px-4 pt-[12vh] backdrop-blur-[2px]"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search plants"
        className="w-full max-w-[600px] overflow-hidden rounded-lg border border-border bg-bg shadow-[0_24px_64px_rgba(10,37,64,0.18)]"
      >
        <div className="flex h-15 items-center gap-3 border-b border-border px-5">
          <Search className="size-5 shrink-0 text-ink-tertiary" aria-hidden />
          <input
            autoFocus
            role="combobox"
            aria-expanded={items.length > 0}
            aria-controls="command-palette-list"
            aria-activedescendant={items.length > 0 ? optionId(activeIndex) : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search plants..."
            className="w-full bg-transparent text-[17px] text-ink caret-accent outline-none placeholder:text-ink-muted"
          />
          <kbd className="rounded-sm bg-surface px-1.5 py-0.5 font-sans text-overline text-ink-tertiary">
            ESC
          </kbd>
        </div>

        <ul id="command-palette-list" role="listbox" className="max-h-[min(60vh,440px)] overflow-y-auto">
          {trimmed && (
            <>
              <SectionLabel>Results</SectionLabel>
              {results.length === 0 && (
                <li role="presentation" className="px-5 py-4 text-body text-ink-tertiary">
                  No plants match &quot;{trimmed}&quot;. Press Enter to search everything.
                </li>
              )}
            </>
          )}
          {results.map((plant, index) => (
            <li
              key={plant.id}
              {...optionProps(index)}
              className={`flex cursor-pointer items-center gap-3 px-5 py-3 ${activeStyle(index)}`}
            >
              <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-surface">
                {plant.photo_url ? (
                  <Image src={plant.photo_url} alt="" fill sizes="40px" className="object-cover" />
                ) : (
                  <Leaf className="size-4 text-ink-muted/50" aria-hidden />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-ink">
                  {plant.name_common}
                </span>
                <span className="block truncate text-body-sm text-ink-tertiary italic">
                  {plant.name_scientific}
                </span>
              </span>
              <CategoryPill category={plant.category[0]} />
              <ArrowRight
                className={`size-4 shrink-0 ${index === activeIndex ? "text-accent" : "text-ink-muted"}`}
                aria-hidden
              />
            </li>
          ))}

          {recent.length > 0 && <SectionLabel>Recent searches</SectionLabel>}
          {recent.map((term, i) => {
            const index = results.length + i;
            return (
              <li
                key={term}
                {...optionProps(index)}
                className={`flex cursor-pointer items-center gap-3 px-5 py-2.5 text-[15px] text-ink-secondary ${activeStyle(index)}`}
              >
                <History className="size-4 text-ink-muted" aria-hidden />
                {term}
              </li>
            );
          })}
        </ul>

        <div className="flex gap-5 border-t border-border bg-bg-secondary px-5 py-2.5 text-body-sm text-ink-muted">
          <Hint keys="↑↓" label="Navigate" />
          <Hint keys="↵" label="Open" />
          <Hint keys="esc" label="Close" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <li role="presentation" className="bg-bg-secondary px-5 py-2.5 text-overline text-ink-tertiary uppercase">
      {children}
    </li>
  );
}

function Hint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="rounded-sm border border-border bg-bg px-1.5 font-sans text-overline text-ink-tertiary">
        {keys}
      </kbd>
      {label}
    </span>
  );
}
