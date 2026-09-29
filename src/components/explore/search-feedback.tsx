import Link from "next/link";
import { ArrowRight, Lightbulb, SearchX } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { exploreHref } from "@/lib/explore-url";

const chip =
  "rounded-full border border-border bg-bg px-3 py-1 text-body-sm text-ink-secondary transition-colors hover:border-ink-muted hover:text-ink";

function SuggestionChips({ names }: { names: string[] }) {
  return names.map((name) => (
    <Link key={name} href={exploreHref({ q: name })} className={chip}>
      {name}
    </Link>
  ));
}

export function NoResults({ query, suggestions }: { query: string; suggestions: string[] }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <span className="flex size-18 items-center justify-center rounded-full bg-surface">
        <SearchX className="size-7 text-ink-tertiary" aria-hidden />
      </span>
      <h2 className="mt-6 text-xl font-semibold text-ink">No plants found</h2>
      <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed text-ink-secondary">
        We couldn&apos;t find any plants matching &quot;{query}&quot;. Try a different spelling or
        browse by category.
      </p>
      <p className="mt-6 text-body-sm font-medium text-ink-muted">Try searching for:</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <SuggestionChips names={suggestions} />
      </div>
      <Link href={exploreHref()} className={`${buttonStyles()} mt-8`}>
        Browse all plants <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

export function SearchHint({ suggestions }: { suggestions: string[] }) {
  return (
    <aside className="flex flex-col gap-4 rounded-md border border-border bg-bg-secondary p-6 md:flex-row md:items-center md:justify-between">
      <div className="flex gap-4">
        <Lightbulb className="mt-0.5 size-5 shrink-0 text-warm" aria-hidden />
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Looking for something else?</h2>
          <p className="mt-0.5 text-body text-ink-secondary">
            Try searching by local name (e.g. &quot;Ewúro&quot;), scientific name, or browse
            categories above.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <SuggestionChips names={suggestions} />
      </div>
    </aside>
  );
}
