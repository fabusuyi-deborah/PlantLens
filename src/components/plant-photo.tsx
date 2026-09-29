import Image from "next/image";
import { Leaf } from "lucide-react";
import type { Plant } from "@/types/plant";

/** A plant's photo, or a leaf placeholder until `photo_url` is curated. Fills its parent. */
export function PlantPhoto({
  plant,
  sizes,
  priority = false,
  iconClassName = "size-10",
}: {
  plant: Pick<Plant, "name_common" | "photo_url">;
  sizes: string;
  priority?: boolean;
  iconClassName?: string;
}) {
  if (plant.photo_url) {
    return (
      <Image
        src={plant.photo_url}
        alt={plant.name_common}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }
  return (
    <div className="flex h-full items-center justify-center bg-accent-light">
      <Leaf className={`text-accent/40 ${iconClassName}`} aria-hidden />
    </div>
  );
}
