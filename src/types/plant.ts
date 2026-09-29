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
  use: string;
  source_citation: string;
}

export interface Caution {
  note: string;
  source_citation: string;
}

export interface Phytochemical {
  compound: string;
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
  traditional_uses: TraditionalUse[];
  cautions: Caution[];
  /** Not yet curated for every plant. */
  phytochemicals?: Phytochemical[];
  photo_url: string;
}
