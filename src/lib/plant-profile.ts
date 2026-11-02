import { getAllPlants } from "@/lib/plants";
import type { CautionSeverity, Plant } from "@/types/plant";

/** Places a use can say it was recorded in, checked in this order. Anything else is "General". */
const REGIONS = [
  "Nigeria", "Ghana", "Cameroon", "Togo", "Uganda", "South Africa", "Ethiopia", "Sierra Leone",
  "Angola", "Burkina Faso", "Upper Volta", "Senegal", "Benin", "Côte d'Ivoire", "Ivory Coast", "Egypt",
  "Madagascar", "Mauritius", "Mozambique", "Sudan", "Kenya", "Tanzania", "Congo", "Gabon",
  "Liberia", "Guinea", "Mali", "Niger", "India", "Brazil", "West Africa", "East Africa",
  "Central Africa", "Caribbean", "Asia",
];

function regionOf(text: string): string {
  return REGIONS.find((region) => text.includes(region)) ?? "General";
}

const severityOrder: Record<CautionSeverity, number> = { high: 0, moderate: 1, low: 2 };

export interface ProfileUse {
  key: string;
  text: string;
  region: string;
  ref: number;
}
export interface ProfileCompound {
  key: string;
  name: string;
  compoundClass?: string;
  text: string;
  ref: number;
}
export interface ProfileName {
  language: string;
  name: string;
  /** Where the name was confirmed, and its number in the Sources list, when recorded. */
  source?: string;
  ref?: number;
}
export interface ProfileCaution {
  key: string;
  severity: CautionSeverity;
  text: string;
  ref: number;
}

/**
 * Everything the plant page shows, with each citation numbered in order of first appearance
 * (uses, then compounds, then cautions, then local names) so the numbers match the Sources list.
 */
export function getPlantProfile(plant: Plant) {
  const refs: string[] = [];
  const refOf = (citation: string) => {
    const index = refs.indexOf(citation);
    if (index >= 0) return index + 1;
    refs.push(citation);
    return refs.length;
  };

  const uses: ProfileUse[] = plant.traditional_uses.map((item, i) => ({
    key: `use-${i}`,
    text: item.title ? `${item.title}: ${item.use}` : item.use,
    region: regionOf(item.use),
    ref: refOf(item.source_citation),
  }));
  const compounds: ProfileCompound[] = (plant.phytochemicals ?? []).map((item, i) => ({
    key: `compound-${i}`,
    name: item.compound,
    compoundClass: item.class,
    text: item.associated_properties,
    ref: refOf(item.source_citation),
  }));
  const cautions: ProfileCaution[] = plant.cautions
    .map((item, i) => ({
      key: `caution-${i}`,
      severity: item.severity ?? "low",
      text: item.title ? `${item.title}: ${item.note}` : item.note,
      ref: refOf(item.source_citation),
    }))
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Name citations come last so the uses, compounds and cautions keep their numbers.
  const names: ProfileName[] = plant.names_local
    .filter((entry) => entry.name)
    .map((entry) => ({
      language: entry.language,
      name: entry.name,
      source: entry.source_citation,
      ref: entry.source_citation ? refOf(entry.source_citation) : undefined,
    }));

  return { uses, compounds, cautions, names, refs };
}

/** Three plants to suggest: ones sharing a category other than "medicinal" first, then any. */
export function getSuggestedPlants(plant: Plant, limit = 3): Plant[] {
  const others = getAllPlants().filter((other) => other.id !== plant.id);
  const close = others.filter((other) =>
    other.category.some((category) => category !== "medicinal" && plant.category.includes(category)),
  );
  return [...close, ...others.filter((other) => !close.includes(other))].slice(0, limit);
}
