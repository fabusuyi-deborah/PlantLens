const abbreviations = { yoruba: "YO", igbo: "IG", hausa: "HA" } as const;

export type MainLanguage = keyof typeof abbreviations;

/** Labelled tag, e.g. "YORUBA  Ewúro". */
export function LabeledNameTag({ label, name }: { label: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3.5 py-1.5">
      <span className="text-overline text-ink-secondary uppercase">{label}</span>
      <span className="text-body-sm font-semibold text-ink">{name}</span>
    </span>
  );
}

/** Compact tag, e.g. "YO Ewúro". */
export function LocalNameTag({ language, name }: { language: MainLanguage; name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-0.5 text-body-sm text-ink">
      <span className="text-overline text-ink-secondary">{abbreviations[language]}</span>
      {name}
    </span>
  );
}
