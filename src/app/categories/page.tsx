import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryMeta } from "@/lib/categories";
import { exploreHref } from "@/lib/explore-url";
import { getAllPlants, getCategoryCounts } from "@/lib/plants";

export const metadata: Metadata = {
  title: "Categories · PlantLens",
  description: "Browse PlantLens's Nigerian plants by how they are used.",
};

export default function CategoriesPage() {
  const plants = getAllPlants();
  const categories = getCategoryCounts();

  return (
    <main className="mx-auto max-w-336 px-4 pt-5 pb-8 md:px-8">
      <header className="text-center">
        <h1 className="text-[2rem] leading-tight font-bold tracking-[-0.8px] text-ink sm:text-page-title">
          Categories
        </h1>
        <p className="mt-1 text-body-lg text-ink-secondary">
          Browse {plants.length} Nigerian plants by their primary use and
          classification.
        </p>
      </header>

      <ul className="mt-5 grid gap-3.5 sm:grid-cols-2">
        {categories.map(({ category, count }) => {
          const {
            icon: Icon,
            pluralLabel,
            description,
            text,
            bg,
          } = categoryMeta[category];
          const href = exploreHref({ category });

          return (
            <li
              key={category}
              className="rounded-md border border-border p-2.5"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-sm ${bg}`}
                >
                  <Icon className={`size-4.5 ${text}`} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-subheading text-ink">
                      <Link
                        href={href}
                        className="transition-colors hover:text-accent"
                      >
                        {pluralLabel}
                      </Link>
                    </h2>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-overline ${bg} ${text}`}
                    >
                      {count} {count === 1 ? "plant" : "plants"}
                    </span>
                  </div>
                  <p className="mt-1 text-body-sm text-ink-secondary">
                    {description}
                  </p>
                  <Link
                    href={href}
                    className="mt-1 inline-flex items-center gap-1 text-body-sm font-medium text-accent transition-colors hover:text-accent-dark"
                  >
                    Explore {pluralLabel}{" "}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
