import Image from "next/image";
import Link from "next/link";
import { CategoryPill } from "@/components/ui/category-pill";
import { mainLocalNames, plantBlurb, plural } from "@/lib/plant-text";
import type { Plant } from "@/types/plant";

/**
 * Cards for the home page. `compact` marks the small cards that sit under a big one on phones:
 * below the sm breakpoint they drop to a square photo and the name.
 */

const tileColors = {
  lavender: "bg-lavender",
  orange: "bg-orange",
  yellow: "bg-yellow",
  pink: "bg-pink",
} as const;
export type TileColor = keyof typeof tileColors;

function Tags({ plant, compact }: { plant: Plant; compact?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? "max-sm:hidden" : ""}`}>
      {plant.category.map((category) => (
        <CategoryPill key={category} category={category} />
      ))}
    </div>
  );
}

function Title({ plant, compact, className = "" }: { plant: Plant; compact?: boolean; className?: string }) {
  return (
    <h3
      className={`font-display leading-tight font-medium tracking-[-0.01em] transition-colors group-hover:text-purple ${
        compact ? "max-sm:text-[0.84rem]" : ""
      } ${className}`}
    >
      {plant.name_common}
    </h3>
  );
}

/** Photo card: photo, tags, name, local names and the botanical name. */
export function PhotoCard({
  plant,
  size = "md",
  shape = "landscape",
  compact,
  sizes,
}: {
  plant: Plant;
  /** "fill" stretches the photo to the card's height (the big card in a grid row span). */
  size?: "md" | "lg" | "fill";
  shape?: "landscape" | "square";
  compact?: boolean;
  sizes: string;
}) {
  const local = mainLocalNames(plant).map((entry) => entry.name).join(" · ");
  const photoShape =
    size === "fill"
      ? "aspect-4/3 sm:aspect-16/10 lg:aspect-auto lg:min-h-80 lg:flex-1"
      : size === "lg"
        ? "aspect-16/10"
        : shape === "square"
          ? "aspect-square"
          : "aspect-4/3";

  return (
    <Link
      href={`/plants/${plant.id}`}
      className={`group flex min-w-0 animate-fade-up flex-col gap-2.5 ${compact ? "max-sm:gap-1.5" : ""}`}
    >
      <div
        className={`relative overflow-hidden rounded-card bg-line ${photoShape} ${
          compact ? "max-sm:aspect-square max-sm:rounded-xl" : ""
        }`}
      >
        <PlantImage plant={plant} sizes={sizes} className="transition-transform duration-600 ease-out group-hover:scale-105" />
      </div>
      <Tags plant={plant} compact={compact} />
      <Title
        plant={plant}
        compact={compact}
        className={size === "md" ? "text-[1.1875rem] sm:truncate" : "text-2xl"}
      />
      <p className={`text-body-sm text-ink-secondary ${compact ? "max-sm:hidden" : ""} ${size === "md" ? "line-clamp-1" : ""}`}>
        {local && (
          <>
            {local}
            <span aria-hidden> · </span>
          </>
        )}
        <i>{plant.name_scientific}</i>
      </p>
    </Link>
  );
}

/** Photo tilted on a coloured tile. `feature` shows the blurb instead of the counts. */
export function TileCard({
  plant,
  color,
  feature = false,
  compact,
  sizes,
}: {
  plant: Plant;
  color: TileColor;
  feature?: boolean;
  compact?: boolean;
  sizes: string;
}) {
  return (
    <Link
      href={`/plants/${plant.id}`}
      className={`group flex h-full min-w-0 animate-fade-up flex-col gap-2.5 ${compact ? "max-sm:gap-1.5" : ""}`}
    >
      <div
        className={`flex items-center justify-center overflow-hidden rounded-card ${tileColors[color]} ${
          feature ? "p-7" : "aspect-square p-4 lg:p-7"
        } ${compact ? "max-sm:aspect-auto max-sm:rounded-xl max-sm:p-2" : "max-sm:aspect-4/3"}`}
      >
        <div
          className={`relative w-full overflow-hidden rounded-xl shadow-[0_18px_36px_-18px_rgba(11,61,39,0.45)] transition-transform duration-500 -rotate-2 group-hover:scale-[1.03] group-hover:rotate-[1.5deg] ${
            feature ? "aspect-4/3" : "h-full"
          } ${compact ? "max-sm:aspect-square max-sm:h-auto" : ""}`}
        >
          <PlantImage plant={plant} sizes={sizes} />
        </div>
      </div>
      <Tags plant={plant} compact={compact} />
      <Title plant={plant} compact={compact} className={feature ? "text-2xl" : "text-[1.1875rem]"} />
      <p className={`min-h-[1.55em] text-body-sm text-ink-secondary ${compact ? "max-sm:hidden" : ""}`}>
        {feature
          ? plantBlurb(plant)
          : `${plural(plant.phytochemicals?.length ?? 0, "compound")} · ${plural(plant.traditional_uses.length, "use")}`}
      </p>
    </Link>
  );
}

/** Small square tile beside the name and blurb, stacked next to a feature TileCard. */
export function SideCard({ plant, color }: { plant: Plant; color: TileColor }) {
  return (
    <Link
      href={`/plants/${plant.id}`}
      className="group grid animate-fade-up grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] items-center gap-4.5 sm:grid-cols-[minmax(0,9.375rem)_minmax(0,1fr)]"
    >
      <div className={`flex aspect-square items-center justify-center rounded-card p-3 sm:p-4 ${tileColors[color]}`}>
        <div className="relative size-full overflow-hidden rounded-xl shadow-[0_18px_36px_-18px_rgba(11,61,39,0.45)] transition-transform duration-500 -rotate-2 group-hover:scale-[1.03] group-hover:rotate-[1.5deg]">
          <PlantImage plant={plant} sizes="150px" />
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <Tags plant={plant} />
        <Title plant={plant} className="text-[1.1875rem]" />
        <p className="line-clamp-2 text-body-sm text-ink-secondary">{plantBlurb(plant)}</p>
      </div>
    </Link>
  );
}

function PlantImage({ plant, sizes, className = "" }: { plant: Plant; sizes: string; className?: string }) {
  if (!plant.photo_url) return <div className="size-full bg-accent-light" />;
  return (
    <Image
      src={plant.photo_url}
      alt=""
      fill
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  );
}
