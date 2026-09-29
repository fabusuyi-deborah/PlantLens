import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { exploreHref, type ExploreQuery } from "@/lib/explore-url";

interface PaginationProps {
  page: number;
  pageCount: number;
  query: Omit<ExploreQuery, "page">;
}

export function Pagination({ page, pageCount, query }: PaginationProps) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const edge =
    "inline-flex h-9 items-center gap-1.5 rounded-sm border border-border px-3 text-body";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={exploreHref({ ...query, page: page - 1 })} className={`${edge} text-ink hover:border-ink-muted`}>
          <ChevronLeft className="size-4" aria-hidden /> Previous
        </Link>
      ) : (
        <span className={`${edge} text-ink-muted`} aria-disabled>
          <ChevronLeft className="size-4" aria-hidden /> Previous
        </span>
      )}

      {pages.map((n) => (
        <Link
          key={n}
          href={exploreHref({ ...query, page: n })}
          aria-current={n === page ? "page" : undefined}
          className={`inline-flex size-9 items-center justify-center rounded-sm text-body font-medium transition-colors ${
            n === page ? "bg-accent text-white" : "text-ink-secondary hover:bg-surface"
          }`}
        >
          {n}
        </Link>
      ))}

      {page < pageCount ? (
        <Link href={exploreHref({ ...query, page: page + 1 })} className={`${edge} text-ink hover:border-ink-muted`}>
          Next <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={`${edge} text-ink-muted`} aria-disabled>
          Next <ChevronRight className="size-4" aria-hidden />
        </span>
      )}
    </nav>
  );
}
