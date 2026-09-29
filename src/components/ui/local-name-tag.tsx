const abbreviations = { yoruba: "YO", igbo: "IG", hausa: "HA" } as const;

export type MainLanguage = keyof typeof abbreviations;

/** Compact tag, e.g. "YO: Ewúro". */
export function LocalNameTag({ language, name }: { language: MainLanguage; name: string }) {
  return (
    <span className="inline-flex items-center rounded-sm bg-surface px-2 py-0.5 text-body-sm text-ink-secondary">
      {abbreviations[language]}: {name}
    </span>
  );
}
