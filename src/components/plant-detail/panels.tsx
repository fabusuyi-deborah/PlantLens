import { FlaskConical, Info, ShieldAlert, TriangleAlert } from "lucide-react";
import { shortCitation } from "@/lib/citations";
import type { Caution, CautionSeverity, Plant } from "@/types/plant";
import { Card, Citation, classPillStyle, EmptyNote, SourcesCard } from "./shared";

function compoundClasses(plant: Plant): string[] {
  return [
    ...new Set((plant.phytochemicals ?? []).map((item) => item.class).filter((c): c is string => Boolean(c))),
  ];
}

function plural(count: number, word: string) {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}

/* ---------- Traditional uses ---------- */

export function UsesPanel({ plant, citations }: { plant: Plant; citations: string[] }) {
  return (
    <div className="space-y-8">
      <Card title="Traditional & Common Uses">
        <ul className="space-y-5">
          {plant.traditional_uses.map((item, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
              <div>
                {item.title && <h3 className="mb-1 text-subheading text-ink">{item.title}</h3>}
                <p className={`text-[15px] leading-relaxed ${item.title ? "text-ink-secondary" : "text-ink"}`}>
                  {item.use}
                </p>
                <Citation>{item.source_citation}</Citation>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      {(plant.phytochemicals?.length ?? 0) > 0 && <CompoundsTable plant={plant} />}
      <SourcesCard citations={citations} />
    </div>
  );
}

function CompoundsTable({ plant }: { plant: Plant }) {
  const compounds = plant.phytochemicals ?? [];
  const classes = compoundClasses(plant);
  const showClass = classes.length > 0;

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-bg-elevated">
      <div className="flex items-center justify-between gap-4 px-6 py-5 md:px-7">
        <h2 className="flex items-center gap-3 text-card-heading text-ink">
          <FlaskConical className="size-5 text-accent" aria-hidden />
          Known Phytochemicals
        </h2>
        <span className="rounded-full bg-accent-light px-2.5 py-0.5 text-body-sm font-semibold text-accent">
          {plural(compounds.length, "compound")}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead className="border-y border-border bg-bg-secondary text-overline text-ink-tertiary uppercase">
            <tr>
              <th className="px-6 py-3 md:px-7">Compound</th>
              {showClass && <th className="px-4 py-3">Class</th>}
              <th className="px-4 py-3">Associated properties</th>
              <th className="px-6 py-3 md:px-7">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {compounds.map((item) => (
              <tr key={item.compound} className="align-top even:bg-bg-secondary/60">
                <td className="px-6 py-3.5 text-body font-medium text-ink md:px-7">{item.compound}</td>
                {showClass && (
                  <td className="px-4 py-3.5">
                    {item.class && (
                      <span
                        className={`inline-block rounded-sm px-1.5 py-0.5 text-caption font-medium tracking-normal ${classPillStyle(item.class, classes)}`}
                      >
                        {item.class}
                      </span>
                    )}
                  </td>
                )}
                <td className="px-4 py-3.5 text-body text-ink-secondary">{item.associated_properties}</td>
                <td className="px-6 py-3.5 text-body-sm whitespace-nowrap text-ink-muted md:px-7" title={item.source_citation}>
                  {shortCitation(item.source_citation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------- Phytochemicals ---------- */

export function PhytochemicalsPanel({ plant, citations }: { plant: Plant; citations: string[] }) {
  const compounds = plant.phytochemicals ?? [];
  const classes = compoundClasses(plant);

  if (compounds.length === 0) {
    return (
      <div className="space-y-8">
        <EmptyNote>
          Phytochemical data for {plant.name_common} hasn&apos;t been curated yet. Check back soon.
        </EmptyNote>
        <SourcesCard citations={citations} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="flex items-center gap-3 text-section text-ink">
          <FlaskConical className="size-5 text-accent" aria-hidden />
          {compounds.length} {compounds.length === 1 ? "Compound" : "Compounds"} Identified
        </h2>
        {classes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {classes.map((compoundClass) => (
              <span
                key={compoundClass}
                className={`rounded-full px-3 py-1 text-body-sm font-medium ${classPillStyle(compoundClass, classes)}`}
              >
                {compounds.filter((item) => item.class === compoundClass).length} {compoundClass}
              </span>
            ))}
          </div>
        )}
      </Card>

      <section>
        <h2 className="mb-5 text-section text-ink">Compound Details</h2>
        <ul className="grid gap-5 md:grid-cols-2">
          {compounds.map((item) => (
            <li key={item.compound} className="flex flex-col rounded-lg border border-border bg-bg-elevated p-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-card-heading text-ink">{item.compound}</h3>
                {item.class && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-caption font-medium tracking-normal ${classPillStyle(item.class, classes)}`}
                  >
                    {item.class}
                  </span>
                )}
              </div>
              <p className="mt-3 flex-1 text-body leading-relaxed text-ink-secondary">
                {item.associated_properties}
              </p>
              <div className="mt-4">
                <Citation>{item.source_citation}</Citation>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <SourcesCard citations={citations} />
    </div>
  );
}

/* ---------- Cautions ---------- */

export const severityStyles: Record<
  CautionSeverity,
  { label: string; badge: string; tile: string; dot: string; description: string }
> = {
  high: {
    label: "High",
    badge: "bg-danger-light text-danger",
    tile: "bg-danger-light text-danger",
    dot: "bg-danger",
    description: "Significant risk documented in literature",
  },
  moderate: {
    label: "Moderate",
    badge: "bg-warm-light text-amber-700",
    tile: "bg-warm-light text-warm",
    dot: "bg-warm",
    description: "Potential risk; caution advised",
  },
  low: {
    label: "Low",
    badge: "bg-accent-light text-accent",
    tile: "bg-accent-light text-accent",
    dot: "bg-accent",
    description: "Minimal risk under normal conditions",
  },
};

const severityIcons = { high: ShieldAlert, moderate: TriangleAlert, low: Info };

function CautionItem({ caution }: { caution: Caution }) {
  const style = caution.severity ? severityStyles[caution.severity] : undefined;
  const Icon = caution.severity ? severityIcons[caution.severity] : TriangleAlert;

  return (
    <li className="flex gap-4 rounded-md border border-border-light bg-bg-secondary p-5">
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-sm ${style?.tile ?? "bg-warm-light text-warm"}`}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        {(caution.title || style) && (
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {caution.title && <h3 className="text-subheading text-ink">{caution.title}</h3>}
            {style && (
              <span className={`rounded-full px-2 py-0.5 text-caption font-medium tracking-normal ${style.badge}`}>
                {style.label}
              </span>
            )}
          </div>
        )}
        <p className="text-[15px] leading-relaxed text-ink-secondary">{caution.note}</p>
        <Citation>{caution.source_citation}</Citation>
      </div>
    </li>
  );
}

export function CautionsPanel({ plant }: { plant: Plant }) {
  return (
    <div className="space-y-8">
      <div className="flex gap-4 rounded-lg border border-danger/30 bg-danger-light/60 p-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-light">
          <ShieldAlert className="size-5 text-danger" aria-hidden />
        </span>
        <div>
          <h2 className="text-subheading text-red-800">Important Medical Disclaimer</h2>
          <p className="mt-0.5 text-body text-red-700">
            The information below is for educational reference only. It does not constitute medical
            advice. Always consult a qualified healthcare provider.
          </p>
        </div>
      </div>

      <Card title="Known Cautions & Contraindications" icon={TriangleAlert} iconClassName="text-warm">
        {plant.cautions.length > 0 ? (
          <ul className="space-y-4">
            {plant.cautions.map((caution, i) => (
              <CautionItem key={i} caution={caution} />
            ))}
          </ul>
        ) : (
          <EmptyNote>
            No cautions have been curated for {plant.name_common} yet. That doesn&apos;t mean it&apos;s
            risk-free, so check with a healthcare provider before medicinal use.
          </EmptyNote>
        )}
      </Card>
    </div>
  );
}
