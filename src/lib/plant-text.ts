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

/** First Yoruba, Igbo and Hausa names, in that order, skipping any that are missing. */
export function mainLocalNames(plant: Pick<Plant, "names_local">) {
  const { yoruba, igbo, hausa } = plant.names_local;
  return (
    [
      ["YO", yoruba],
      ["IG", igbo],
      ["HA", hausa],
    ] as const
  )
    .map(([code, names]) => ({ code, name: firstName(names) }))
    .filter((entry) => entry.name);
}

export function plural(count: number, word: string): string {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}
