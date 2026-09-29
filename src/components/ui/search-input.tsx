import Link from "next/link";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  className?: string;
  size?: "lg" | "md";
  defaultValue?: string;
  /** Kept as a hidden field so searching doesn't reset the category filter. */
  category?: string;
  /** When set, shows a clear (×) button linking here. */
  clearHref?: string;
}

/** Search field. Submits to /explore?q=… */
export function SearchInput({
  className = "",
  size = "lg",
  defaultValue,
  category,
  clearHref,
}: SearchInputProps) {
  const active = Boolean(defaultValue);

  return (
    <form action="/explore" role="search" className={className}>
      {category && <input type="hidden" name="category" value={category} />}
      <label
        className={`flex items-center gap-3 rounded-md bg-bg transition-colors focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/15 ${
          size === "lg"
            ? "h-12 border border-border px-5 shadow-[0_1px_2px_rgba(10,37,64,0.04)]"
            : "h-11 px-4"
        } ${size === "md" && (active ? "border-2 border-accent" : "border border-border")}`}
      >
        <Search
          className={`shrink-0 ${size === "lg" ? "size-4.5" : "size-4"} ${active ? "text-accent" : "text-ink-muted"}`}
          aria-hidden
        />
        <span className="sr-only">Search plants</span>
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search by name, local name, or category..."
          className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-muted [&::-webkit-search-cancel-button]:hidden"
        />
        {active && clearHref && (
          <Link
            href={clearHref}
            aria-label="Clear search"
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface text-ink-tertiary transition-colors hover:bg-border hover:text-ink"
          >
            <X className="size-3" aria-hidden />
          </Link>
        )}
      </label>
    </form>
  );
}
