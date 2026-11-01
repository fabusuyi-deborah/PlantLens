import data from "../../plants.json";
import { languageKey } from "@/lib/plant-text";
import type { Plant, PlantCategory } from "@/types/plant";

const plants = data as Plant[];

export function getAllPlants(): Plant[] {
  return plants;
}

export function getPlantById(id: string): Plant | undefined {
  return plants.find((plant) => plant.id === id);
}

export function getPlantsByIds(ids: string[]): Plant[] {
  return ids
    .map((id) => getPlantById(id))
    .filter((plant): plant is Plant => plant !== undefined);
}


/** Categories with their plant counts, most common first. */
export function getCategoryCounts(): { category: PlantCategory; count: number }[] {
  const counts = new Map<PlantCategory, number>();
  for (const plant of plants) {
    for (const category of plant.category) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getDatasetStats() {
  const compounds = new Set<string>();
  const citations = new Set<string>();
  const languages = new Set<string>();

  for (const plant of plants) {
    for (const item of plant.phytochemicals ?? []) {
      compounds.add(item.compound.toLowerCase());
    }
    for (const item of [
      ...plant.traditional_uses,
      ...plant.cautions,
      ...(plant.phytochemicals ?? []),
    ]) {
      citations.add(item.source_citation);
    }
    for (const entry of plant.names_local) {
      // "Efik/Ibibio" counts as both Efik and Ibibio.
      for (const language of entry.language.split("/")) languages.add(language.trim().toLowerCase());
    }
  }

  return {
    plants: plants.length,
    compounds: compounds.size,
    languages: languages.size,
    citations: citations.size,
  };
}

/** A language needs names for this many plants before /explore offers it as a card language. */
const MIN_PLANTS_PER_NAME_LANGUAGE = 3;

/** Languages /explore can show card names in, most plants first. */
export function getNameLanguages(): { value: string; label: string; count: number }[] {
  const counts = new Map<string, { label: string; count: number }>();
  for (const plant of plants) {
    for (const entry of plant.names_local) {
      const key = languageKey(entry.language);
      const current = counts.get(key) ?? { label: entry.language, count: 0 };
      counts.set(key, { ...current, count: current.count + 1 });
    }
  }
  return [...counts]
    .map(([value, { label, count }]) => ({ value, label, count }))
    .filter((option) => option.count >= MIN_PLANTS_PER_NAME_LANGUAGE)
    .sort((a, b) => b.count - a.count);
}
