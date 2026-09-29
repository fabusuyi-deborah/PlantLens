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
  const { yoruba, igbo, hausa, other = [] } = plant.names_local;
  return [
    plant.name_common,
    plant.name_scientific,
    ...[yoruba, igbo, hausa].filter((name): name is string => Boolean(name)),
    ...other.map((entry) => entry.name),
    ...plant.category.map((category) => categoryMeta[category].label),
  ].map(normalize);
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
