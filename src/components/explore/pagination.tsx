import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { chipStyles } from "@/components/ui/button";
import { exploreHref, type ExploreQuery } from "@/lib/explore-url";

interface PaginationProps {
  page: number;
  pageCount: number;
  query: Omit<ExploreQuery, "page">;
}

const disabled = `${chipStyles} pointer-events-none opacity-35`;

export function Pagination({ page, pageCount, query }: PaginationProps) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap justify-center gap-2">
      {page > 1 ? (
        <Link href={exploreHref({ ...query, page: page - 1 })} className={chipStyles}>
          <ArrowLeft className="size-3.5" aria-hidden /> Prev
        </Link>
      ) : (
        <span className={disabled} aria-disabled>
          <ArrowLeft className="size-3.5" aria-hidden /> Prev
        </span>
      )}
      {pages.map((n) => (
        <Link
          key={n}
          href={exploreHref({ ...query, page: n })}
          aria-current={n === page ? "page" : undefined}
          aria-label={`Page ${n}`}
          className={`${chipStyles} w-10.5 justify-center px-0`}
        >
          {n}
        </Link>
      ))}
      {page < pageCount ? (
        <Link href={exploreHref({ ...query, page: page + 1 })} className={chipStyles}>
          Next <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      ) : (
        <span className={disabled} aria-disabled>
          Next <ArrowRight className="size-3.5" aria-hidden />
        </span>
      )}
    </nav>
  );
}
