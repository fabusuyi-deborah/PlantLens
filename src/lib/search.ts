import { categoryMeta } from "@/lib/categories";
import type { Plant } from "@/types/plant";

/** The fields search needs. Small enough to send to the client for the command palette. */
export type SearchablePlant = Pick<
  Plant,
  "id" | "name_common" | "name_scientific" | "names_local" | "category" | "photo_url"
>;

export function toSearchable(plant: Plant): SearchablePlant {
  const { id, name_common, name_scientific, names_local, category, photo_url } = plant;
  return { id, name_common, name_scientific, names_local, category, photo_url };
}

/** Lowercase and strip accents, so "ewuro" matches "Ewúro". */
function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

function searchFields(plant: SearchablePlant): string[] {
  return [
    plant.name_common,
    plant.name_scientific,
    ...plant.names_local.map((entry) => entry.name),
    ...plant.category.map((category) => categoryMeta[category].label),
  ].map(normalize);
}

/**
 * Why a plant matched, for result rows: "Yoruba · Ewuro" when a local name matched, otherwise
 * "English", "Botanical" or "Category".
 */
export function describeMatch(plant: SearchablePlant, query: string): string {
  const normalizedQuery = normalize(query);
  const firstWord = normalizedQuery.split(/\s+/)[0] ?? "";
  const fields: [string, string | undefined][] = [
    ["English", plant.name_common],
    ["Botanical", plant.name_scientific],
    ...plant.names_local.map((entry): [string, string] => [entry.language, entry.name]),
    ...plant.category.map((category): [string, string] => ["Category", categoryMeta[category].label]),
  ];
  const present = fields.filter((field): field is [string, string] => Boolean(field[1]));
  const hit =
    present.find(([, value]) => normalize(value).includes(normalizedQuery)) ??
    present.find(([, value]) => normalize(value).includes(firstWord));
  if (!hit) return "";
  const [label, value] = hit;
  if (label === "English" || label === "Botanical" || label === "Category") return label;
  const part = value.split("/").find((name) => normalize(name).includes(firstWord)) ?? value;
  return `${label} · ${part.trim()}`;
}

/**
 * Matches plants whose names (common, scientific, local) or categories contain every word
 * of the query. Best matches on the common name come first.
 */
export function searchPlants<T extends SearchablePlant>(plants: T[], query: string): T[] {
  const normalizedQuery = normalize(query);
  const words = normalizedQuery.split(/\s+/).filter(Boolean);
  if (words.length === 0) return plants;

  return plants
    .map((plant) => {
      const fields = searchFields(plant);
      const matches = words.every((word) => fields.some((field) => field.includes(word)));
      if (!matches) return null;
      const name = fields[0];
      const rank =
        name === normalizedQuery ? 0 : name.startsWith(normalizedQuery) ? 1 : name.includes(normalizedQuery) ? 2 : 3;
      return { plant, rank };
    })
    .filter((result) => result !== null)
    .sort((a, b) => a.rank - b.rank)
    .map((result) => result.plant);
}
