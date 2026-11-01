/** Caution severity colours and descriptions, shared by the caution list and its legend. */
export const severityStyles = {
  high: { pill: "bg-rust text-paper", description: "Significant risk documented in literature" },
  moderate: { pill: "bg-orange text-ink", description: "Potential risk; caution advised" },
  low: { pill: "bg-mint text-ink", description: "Minimal risk under normal conditions" },
} as const;

export function SeverityPill({ severity }: { severity: keyof typeof severityStyles }) {
  return (
    <span
      className={`inline-flex min-h-6.5 items-center self-start rounded-full px-3 text-[0.6875rem] font-bold tracking-widest uppercase ${severityStyles[severity].pill}`}
    >
      {severity}
    </span>
  );
}
