import type { AfricanRegion } from "@/types/plant";

/** Display labels, in the order regions are listed on a plant. */
export const regionLabels: Record<AfricanRegion, string> = {
  west: "West Africa",
  central: "Central Africa",
  east: "East Africa",
  southern: "Southern Africa",
  north: "North Africa",
};

const order = Object.keys(regionLabels) as AfricanRegion[];

/** "West, Central and East Africa", for a plant's regions in a consistent order. */
export function formatRegions(regions: AfricanRegion[]): string {
  const sorted = order.filter((region) => regions.includes(region));
  if (sorted.length === 0) return "";
  if (sorted.length === order.length) return "Across Africa";
  const short = sorted.map((region) => regionLabels[region].replace(" Africa", ""));
  const list = short.length === 1 ? short[0] : `${short.slice(0, -1).join(", ")} and ${short.at(-1)}`;
  return `${list} Africa`;
}
