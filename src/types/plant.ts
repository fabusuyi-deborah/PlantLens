export type PlantCategory =
  | "medicinal"
  | "culinary"
  | "leafy_vegetable"
  | "vegetable"
  | "spice"
  | "beverage"
  | "stimulant";

export interface LocalName {
  /** Language or people, e.g. "Yoruba", "Swahili" or "Akan (Ghana)". */
  language: string;
  /** One name, or alternatives separated by " / ". */
  name: string;
  /** Where the name was confirmed. Optional for the original Yoruba, Igbo and Hausa names. */
  source_citation?: string;
  /**
   * false while the name comes only from a lead (Wikidata, an online post) and hasn't been confirmed in a
   * published reference yet. The site labels these names "not yet verified".
   */
  verified?: boolean;
}

/** Parts of Africa where a plant grows wild or is commonly cultivated. */
export type AfricanRegion = "west" | "central" | "east" | "southern" | "north";

export interface TraditionalUse {
  /** Optional short heading, e.g. "Fever & Malaria Treatment". */
  title?: string;
  use: string;
  source_citation: string;
}

export type CautionSeverity = "high" | "moderate" | "low";

export interface Caution {
  /** Optional short heading, e.g. "Pregnancy & Breastfeeding". */
  title?: string;
  severity?: CautionSeverity;
  note: string;
  source_citation: string;
}

export interface Phytochemical {
  compound: string;
  /** Optional compound class, e.g. "Flavonoid" or "Sesquiterpene lactone". */
  class?: string;
  associated_properties: string;
  source_citation: string;
}

export interface Plant {
  id: string;
  name_common: string;
  name_scientific: string;
  /** Local names, most widely spoken languages first. */
  names_local: LocalName[];
  regions: AfricanRegion[];
  /** Where the regions come from: the plant's Plants of the World Online page. */
  regions_source?: { citation: string; url: string };
  category: PlantCategory[];
  description: string;
  /** Optional botanical family, e.g. "Asteraceae". */
  family?: string;
  /** Optional plant parts used, e.g. ["Leaves", "Roots"]. */
  parts_used?: string[];
  traditional_uses: TraditionalUse[];
  cautions: Caution[];
  /** Not yet curated for every plant. */
  phytochemicals?: Phytochemical[];
  photo_url: string;
  /** Attribution for `photo_url`; required by CC BY / CC BY-SA licenses. */
  photo_credit?: PhotoCredit;
}

export interface PhotoCredit {
  author: string;
  /** e.g. "CC BY-SA 4.0" or "CC0". */
  license: string;
  source_url: string;
}
