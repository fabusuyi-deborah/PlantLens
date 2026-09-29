const abbreviations = { yoruba: "YO", igbo: "IG", hausa: "HA" } as const;

export type MainLanguage = keyof typeof abbreviations;

/** Labelled tag, e.g. "YORUBA | Ewúro". */
export function LabeledNameTag({ label, name }: { label: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-sm border border-border bg-bg-secondary px-3 py-1.5">
      <span className="text-overline text-ink-muted uppercase">{label}</span>
      <span className="h-3.5 w-px bg-border" aria-hidden />
      <span className="text-[15px] text-ink">{name}</span>
    </span>
  );
}

/** Compact tag, e.g. "YO: Ewúro". */
export function LocalNameTag({ language, name }: { language: MainLanguage; name: string }) {
  return (
    <span className="inline-flex items-center rounded-sm bg-surface px-2 py-0.5 text-body-sm text-ink-secondary">
      {abbreviations[language]}: {name}
    </span>
  );
}
