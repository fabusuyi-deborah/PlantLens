import Image from "next/image";
import Link from "next/link";
import { CategoryPill } from "@/components/ui/category-pill";
import { firstName, localNameIn } from "@/lib/plant-text";
import type { Plant } from "@/types/plant";

/** Tile colours behind the photo in the phone list, cycling down the page. */
const tileColors = ["bg-lavender", "bg-orange", "bg-yellow", "bg-pink"];

/**
 * A result on /explore. A photo card from the sm breakpoint up; on phones a compact row with a
 * square photo on a coloured tile beside the name, local name and botanical name.
 */
export function ExploreCard({
  plant,
  names,
  namesLabel,
  index,
}: {
  plant: Plant;
  /** Language key, e.g. "yoruba". */
  names: string;
  namesLabel: string;
  index: number;
}) {
  const local = firstName(localNameIn(plant, names));

  return (
    <Link
      href={`/plants/${plant.id}`}
      className="group grid min-w-0 animate-fade-up grid-cols-[7.375rem_minmax(0,1fr)] grid-rows-[auto_auto_auto] items-center gap-x-4 gap-y-1.5 sm:flex sm:flex-col sm:items-stretch sm:gap-2.5"
    >
      <div
        className={`row-span-3 self-start rounded-[20px] sm:self-stretch p-2.25 sm:rounded-card sm:bg-line sm:p-0 ${tileColors[index % tileColors.length]}`}
      >
        <div className="relative aspect-square overflow-hidden rounded-xl sm:aspect-4/3 sm:rounded-card">
          {plant.photo_url && (
            <Image
              src={plant.photo_url}
              alt={plant.name_common}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 118px"
              className="object-cover transition-transform duration-600 ease-out group-hover:scale-105"
            />
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 self-end sm:self-auto [&>*:nth-child(n+3)]:max-sm:hidden">
        {plant.category.map((category) => (
          <CategoryPill key={category} category={category} />
        ))}
      </div>
      <h2 className="font-display text-xl leading-[1.1] font-medium tracking-[-0.01em] transition-colors group-hover:text-purple sm:text-[1.1875rem] sm:leading-tight">
        {plant.name_common}
      </h2>
      <p className="self-start sm:self-auto text-body-sm leading-[1.35] font-semibold text-ink sm:font-normal sm:text-ink-secondary">
        {local || <span className="font-normal text-ink-muted">No {namesLabel} name yet</span>}
        <span className="hidden sm:inline" aria-hidden>
          {" · "}
        </span>
        <i className="block font-normal text-ink-secondary sm:inline">{plant.name_scientific}</i>
      </p>
    </Link>
  );
}
