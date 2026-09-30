import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PlantPhoto } from "@/components/plant-photo";
import { categoryMeta } from "@/lib/categories";
import { exploreHref } from "@/lib/explore-url";
import { getAllPlants, getCategoryCounts } from "@/lib/plants";

export const metadata: Metadata = {
  title: "Categories · PlantLens",
  description: "Browse PlantLens's Nigerian plants by how they are used.",
};

const PREVIEW_COUNT = 4;

export default function CategoriesPage() {
  const plants = getAllPlants();
  const categories = getCategoryCounts();

  return (
    <main className="mx-auto max-w-336 px-4 pt-10 pb-16 md:px-8">
      <PageHeader
        title="Categories"
        subtitle={`${plants.length} plants grouped by how they are used. Many plants belong to more than one category.`}
      />

      <ul className="mt-10 divide-y divide-border rounded-lg border border-border">
        {categories.map(({ category, count }) => {
          const { icon: Icon, pluralLabel, description, text, bg } = categoryMeta[category];
          const members = plants.filter((plant) => plant.category.includes(category));
          const preview = members.slice(0, PREVIEW_COUNT);
          const remaining = members.length - preview.length;
          const href = exploreHref({ category });

          return (
            <li
              key={category}
              className="grid gap-5 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] md:items-center md:gap-8"
            >
              <div className="flex gap-4">
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-sm ${bg}`}>
                  <Icon className={`size-5 ${text}`} aria-hidden />
                </span>
                <div>
                  <h2 className="text-card-heading text-ink">
                    <Link href={href} className="transition-colors hover:text-accent">
                      {pluralLabel}
                    </Link>
                  </h2>
                  <p className="text-body-sm text-ink-tertiary">
                    {count} {count === 1 ? "plant" : "plants"}
                  </p>
                  <p className="mt-2 text-body text-ink-secondary">{description}</p>
                </div>
              </div>

              <ul className="flex flex-wrap gap-2" aria-label={`Plants in ${pluralLabel}`}>
                {preview.map((plant) => (
                  <li key={plant.id}>
                    <Link
                      href={`/plants/${plant.id}`}
                      className="flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1 text-body-sm font-medium text-ink-secondary transition-colors hover:border-ink-muted hover:text-ink"
                    >
                      <span className="relative size-6 overflow-hidden rounded-full">
                        <PlantPhoto plant={plant} sizes="24px" iconClassName="size-3" />
                      </span>
                      {plant.name_common}
                    </Link>
                  </li>
                ))}
                {remaining > 0 && (
                  <li className="flex items-center px-1 text-body-sm text-ink-muted">
                    +{remaining} more
                  </li>
                )}
              </ul>

              <Link
                href={href}
                className="inline-flex items-center gap-1.5 text-body font-medium whitespace-nowrap text-accent transition-colors hover:text-accent-dark"
              >
                View all <ArrowRight className="size-4" aria-hidden />
                <span className="sr-only">{pluralLabel}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
