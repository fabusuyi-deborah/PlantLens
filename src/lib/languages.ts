/**
 * Where each language is mainly spoken, so a plant's local names can be grouped by region.
 * Add a language here when it first appears in plants.json; unlisted ones show under "Other".
 */
const languageRegions: Record<string, string> = {
  Yoruba: "West Africa",
  Igbo: "West Africa",
  Hausa: "West Africa",
  Igala: "West Africa",
  Edo: "West Africa",
  Efik: "West Africa",
  Ibibio: "West Africa",
  "Efik/Ibibio": "West Africa",
  Ikwerre: "West Africa",
  Etche: "West Africa",
  "Akan (Twi)": "West Africa",
  Fula: "West Africa",
  Swahili: "East Africa",
  Zulu: "Southern Africa",
};

const regionOrder = ["West Africa", "Central Africa", "East Africa", "North Africa", "Southern Africa", "Other"];

export function languageRegion(language: string): string {
  return languageRegions[language] ?? "Other";
}

/** Groups names by region (in a fixed order), keeping the data's order inside each group. */
export function groupByRegion<T extends { language: string }>(entries: T[]): { region: string; entries: T[] }[] {
  return regionOrder
    .map((region) => ({ region, entries: entries.filter((entry) => languageRegion(entry.language) === region) }))
    .filter((group) => group.entries.length > 0);
}
