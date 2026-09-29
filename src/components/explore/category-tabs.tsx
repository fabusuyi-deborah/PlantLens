import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { categoryMeta } from "@/lib/categories";
import { exploreHref } from "@/lib/explore-url";
import type { PlantCategory } from "@/types/plant";

interface CategoryFilterProps {
  categories: PlantCategory[];
  active?: PlantCategory;
  q?: string;
}

/** Underlined row of category tabs. */
export function CategoryTabs({ categories, active, q }: CategoryFilterProps) {
  const tabs = [
    { key: "all", label: "All", href: exploreHref({ q }), isActive: !active },
    ...categories.map((category) => ({
      key: category,
      label: categoryMeta[category].pluralLabel,
      href: exploreHref({ q, category }),
      isActive: active === category,
    })),
  ];

  return (
    <nav aria-label="Categories" className="border-b border-border">
      <ul className="-mb-px flex gap-2 overflow-x-auto pb-2.5">
        {tabs.map((tab) => (
          <li key={tab.key} className="shrink-0">
            <Link
              href={tab.href}
              aria-current={tab.isActive ? "page" : undefined}
              className={`inline-block rounded-full px-3.5 py-1.5 text-body transition-colors ${
                tab.isActive
                  ? "bg-accent-light font-semibold text-accent"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** "All Categories" plus a few shortcut buttons, shown beside the search field. */
export function QuickFilters({ categories, active, q }: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto">
      <Link
        href={exploreHref({ q })}
        className={`${buttonStyles({ variant: active ? "secondary" : "primary" })} h-11 shrink-0`}
      >
        <LayoutGrid className="size-4" aria-hidden />
        All Categories
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={exploreHref({ q, category })}
          className={`${buttonStyles({ variant: active === category ? "primary" : "secondary" })} h-11 shrink-0`}
        >
          {categoryMeta[category].label}
        </Link>
      ))}
    </div>
  );
}
