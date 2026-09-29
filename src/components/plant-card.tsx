import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { CategoryPill } from "@/components/ui/category-pill";
import { LocalNameTag, type MainLanguage } from "@/components/ui/local-name-tag";
import type { Plant } from "@/types/plant";

const languages: MainLanguage[] = ["yoruba", "igbo", "hausa"];

export function PlantCard({ plant }: { plant: Plant }) {
  const compoundCount = plant.phytochemicals?.length ?? 0;

  return (
    <Link
      href={`/plants/${plant.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-bg-elevated transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,37,64,0.08)]"
    >
      <div className="relative aspect-3/2 overflow-hidden bg-accent-light">
        {plant.photo_url ? (
          <Image
            src={plant.photo_url}
            alt={plant.name_common}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Leaf className="size-10 text-accent/40" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-1.5">
          {plant.category.slice(0, 2).map((category) => (
            <CategoryPill key={category} category={category} />
          ))}
        </div>
        <h3 className="mt-3 text-card-heading text-ink">{plant.name_common}</h3>
        <p className="text-body-sm text-ink-tertiary italic">{plant.name_scientific}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {languages.map((language) => {
            const name = plant.names_local[language];
            return name ? <LocalNameTag key={language} language={language} name={name} /> : null;
          })}
        </div>

        {compoundCount > 0 && (
          <p className="mt-auto pt-4 text-caption text-ink-tertiary uppercase">
            {compoundCount} {compoundCount === 1 ? "compound" : "compounds"}
          </p>
        )}
      </div>
    </Link>
  );
}
