import type { Plant } from "@/types/plant";

/** Every distinct citation on a plant, in the order they first appear. */
export function getPlantCitations(plant: Plant): string[] {
  const items = [...plant.traditional_uses, ...(plant.phytochemicals ?? []), ...plant.cautions];
  return [...new Set(items.map((item) => item.source_citation))];
}

export const citesNmppdb = (citation: string) => citation.includes("NMPPDB");
export const citesDuke = (citation: string) => /duke/i.test(citation);

/** Compact label for tight spaces, e.g. "Erasto et al. (2007)" or "Dr. Duke's". */
export function shortCitation(citation: string): string {
  const authorYear = citation.match(/^[^()]{1,60}?\(\d{4}\)/);
  if (authorYear) return authorYear[0];
  if (citesDuke(citation)) return "Dr. Duke's";
  if (/^NMPPDB/.test(citation)) return "NMPPDB";
  return citation.length > 48 ? `${citation.slice(0, 45).trimEnd()}…` : citation;
}

/** Named databases a plant's data comes from, plus whether other literature is cited. */
export function getDataSources(citations: string[]): string {
  const sources: string[] = [];
  if (citations.some(citesNmppdb)) sources.push("NMPPDB");
  if (citations.some(citesDuke)) sources.push("Dr. Duke's");
  const hasOther = citations.some((c) => !citesNmppdb(c) && !citesDuke(c));
  if (hasOther) sources.push(sources.length ? "other literature" : "Published literature");
  return sources.join(", ");
}
