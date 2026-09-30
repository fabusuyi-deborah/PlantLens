import Image from "next/image";
import { Leaf } from "lucide-react";
import type { PhotoCredit as PhotoCreditData, Plant } from "@/types/plant";

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

/** Attribution line for a plant's photo, as CC BY / CC BY-SA require. Renders nothing without a credit. */
export function PhotoCredit({ credit, className = "" }: { credit?: PhotoCreditData; className?: string }) {
  if (!credit) return null;
  const licenseHref = getLicenseUrl(credit.license);
  const linkClass = "underline decoration-border underline-offset-2 transition-colors hover:text-ink";
  return (
    <p className={`text-body-sm text-ink-tertiary ${className}`}>
      <a href={credit.source_url} target="_blank" rel="noreferrer" className={linkClass}>
        Photo
      </a>{" "}
      by {credit.author} ·{" "}
      {licenseHref ? (
        <a href={licenseHref} target="_blank" rel="noreferrer license" className={linkClass}>
          {credit.license}
        </a>
      ) : (
        credit.license
      )}
    </p>
  );
}

/** Creative Commons deed for a license name like "CC BY-SA 3.0", "CC BY-NC 4.0" or "CC0". */
function getLicenseUrl(license: string): string | undefined {
  if (/^cc0/i.test(license)) return "https://creativecommons.org/publicdomain/zero/1.0/";
  const match = license.match(/^cc (by(?:-nc)?(?:-sa|-nd)?) ([\d.]+)/i);
  return match
    ? `https://creativecommons.org/licenses/${match[1].toLowerCase()}/${match[2]}/`
    : undefined;
}
