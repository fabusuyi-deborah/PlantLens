export type PlantCategory =
  | "medicinal"
  | "culinary"
  | "leafy_vegetable"
  | "vegetable"
  | "spice"
  | "beverage"
  | "stimulant";

export interface OtherLocalName {
  /** Language, people or region, e.g. "Edo" or "Akan (Ghana)". */
  label: string;
  name: string;
}

export interface LocalNames {
  yoruba?: string;
  igbo?: string;
  hausa?: string;
  other?: OtherLocalName[];
}

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
  names_local: LocalNames;
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
