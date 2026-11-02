import Link from "next/link";
import { BrokenLeaf } from "@/components/ui/broken-leaf";
import { buttonStyles, chipStyles } from "@/components/ui/button";
import { exploreHref } from "@/lib/explore-url";

const suggestions = ["Bitter leaf", "Moringa", "Ewuro", "Zogale", "Ginger"];

export function NoResults({ query, inCategory }: { query: string; inCategory: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
      <BrokenLeaf size={120} className="mb-1" />
      <h2 className="font-display text-[1.75rem] font-medium text-green">No plants found</h2>
      <p className="max-w-[30em] text-ink-secondary">
        We couldn&apos;t find any plants matching “{query}”{inCategory && " in this category"}. Try a
        different spelling or browse by category.
      </p>
      <p className="mt-2 text-overline text-ink-secondary uppercase">Try searching for</p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {suggestions.map((name) => (
          <Link key={name} href={exploreHref({ q: name })} className={chipStyles}>
            {name}
          </Link>
        ))}
      </div>
      <Link href={exploreHref()} className={`${buttonStyles()} mt-2.5`}>
        Browse all plants
      </Link>
    </div>
  );
}

export function SearchHint() {
  return (
    <section aria-label="Search tips" className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-panel bg-pink px-6 py-5.5">
      <div>
        <h2 className="font-display text-xl font-medium text-green">Looking for something else?</h2>
        <p className="mt-1">
          Try searching by local name (e.g. “Ewúro”), scientific name, or browse the categories above.
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((name) => (
          <Link
            key={name}
            href={exploreHref({ q: name })}
            className="inline-flex min-h-10 items-center rounded-full bg-paper px-4 text-[0.8125rem] font-bold text-green transition-colors hover:bg-yellow hover:text-ink"
          >
            {name}
          </Link>
        ))}
      </div>
    </section>
  );
}
