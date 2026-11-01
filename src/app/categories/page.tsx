import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { categoryMeta } from "@/lib/categories";
import { exploreHref } from "@/lib/explore-url";
import { plural } from "@/lib/plant-text";
import { getAllPlants, getCategoryCounts, getPlantById } from "@/lib/plants";
import type { PlantCategory } from "@/types/plant";

export const metadata: Metadata = {
  title: "Categories · PlantLens",
  description: "Browse Nigerian plants by their primary use: medicinal, leafy vegetables, spices, drinks and more.",
};

/** The plant whose photo stands for each category. */
const covers: Record<PlantCategory, string> = {
  medicinal: "neem",
  leafy_vegetable: "ugwu",
  spice: "ginger",
  beverage: "roselle-zobo",
  culinary: "scent-leaf",
  stimulant: "kola-nut",
  vegetable: "garden-egg",
};

const tiles = ["bg-lavender", "bg-orange", "bg-yellow", "bg-pink", "bg-mint"];

export default function CategoriesPage() {
  const plants = getAllPlants();

  return (
    <main>
      <PageHeader
        title="Browse by category"
        subtitle={`Browse ${plants.length} Nigerian plants by their primary use and classification. Most plants sit in more than one.`}
      />
      <ul className="mx-auto grid max-w-300 gap-x-5.5 gap-y-9 px-4 pt-2 pb-18 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
        {getCategoryCounts().map(({ category, count }, i) => {
          const { pluralLabel, description } = categoryMeta[category];
          const members = plants.filter((plant) => plant.category.includes(category));
          const names = members.slice(0, 4).map((plant) => plant.name_common).join(", ");
          const cover = getPlantById(covers[category])?.photo_url;
          return (
            <li key={category}>
              <Link href={exploreHref({ category })} className="group flex h-full animate-fade-up flex-col gap-2.5">
                <div className={`flex items-center justify-center rounded-card p-4.5 ${tiles[i % tiles.length]}`}>
                  <div className="relative aspect-4/3 w-full -rotate-2 overflow-hidden rounded-xl shadow-[0_18px_36px_-18px_rgba(11,61,39,0.45)] transition-transform duration-500 group-hover:scale-[1.03] group-hover:rotate-[1.5deg]">
                    {cover && <Image src={cover} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover" />}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2.5">
                  <h2 className="font-display text-2xl font-medium tracking-[-0.02em] text-green transition-colors group-hover:text-purple">
                    {pluralLabel}
                  </h2>
                  <span className="inline-flex min-h-5.5 shrink-0 items-center rounded-full bg-pink px-2.5 text-[0.65625rem] font-bold tracking-[0.08em] uppercase">
                    {plural(count, "plant")}
                  </span>
                </div>
                <p className="text-ink-secondary">{description}</p>
                <p className="text-body-sm text-ink-secondary">
                  {names}
                  {members.length > 4 && ` and ${members.length - 4} more`}
                </p>
                <span className="mt-1 inline-flex items-center gap-2 self-start border-b-2 border-yellow pb-0.5 text-caption font-bold tracking-[0.14em] text-green uppercase">
                  Explore {pluralLabel.toLowerCase()} <ArrowRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
