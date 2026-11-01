import type { Plant } from "@/types/plant";

/** First of several slash-separated names: "Ewuro / Ewuro-jije" → "Ewuro". */
export function firstName(names?: string): string {
  return (names ?? "").split("/")[0].trim();
}

/** The plant's description cut to its first sentence, for cards and the hero. */
export function plantBlurb(plant: Pick<Plant, "description">): string {
  const sentence = plant.description.split(". ")[0].replace(/\.$/, "");
  return `${sentence}.`;
}

/** URL-safe key for a language: "Akan (Ghana)" → "akan-ghana". */
export function languageKey(language: string): string {
  return language
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** The plant's names in one language (by key), or "" if it has none. */
export function localNameIn(plant: Pick<Plant, "names_local">, key: string): string {
  return plant.names_local.find((entry) => languageKey(entry.language) === key)?.name ?? "";
}

/** The plant's first few local names, each with a two-letter code: "YO · Ewuro". */
export function mainLocalNames(plant: Pick<Plant, "names_local">, limit = 3) {
  return plant.names_local
    .slice(0, limit)
    .map((entry) => ({
      code: entry.language.slice(0, 2).toUpperCase(),
      language: entry.language,
      name: firstName(entry.name),
    }))
    .filter((entry) => entry.name);
}

export function plural(count: number, word: string): string {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}
