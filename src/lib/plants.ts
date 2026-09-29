import data from "../../plants.json";
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

/** Plants sharing the most categories with the given one. */
export function getRelatedPlants(plant: Plant, limit = 3): Plant[] {
  return plants
    .filter((other) => other.id !== plant.id)
    .map((other) => ({
      other,
      shared: other.category.filter((category) => plant.category.includes(category)).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ other }) => other);
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
    for (const language of ["yoruba", "igbo", "hausa"] as const) {
      if (plant.names_local[language]) languages.add(language);
    }
  }

  return {
    plants: plants.length,
    compounds: compounds.size,
    languages: languages.size,
    citations: citations.size,
  };
}
