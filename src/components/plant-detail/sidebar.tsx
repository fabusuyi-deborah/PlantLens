import Link from "next/link";
import {
  ChevronRight,
  Database,
  FlaskConical,
  GitFork,
  Scissors,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { PlantPhoto } from "@/components/plant-photo";
import { categoryMeta } from "@/lib/categories";
import { getDataSources } from "@/lib/citations";
import type { CautionSeverity, Plant } from "@/types/plant";
import { severityStyles } from "./panels";

const box = "rounded-lg border border-border p-6";

export function QuickFacts({ plant, citations }: { plant: Plant; citations: string[] }) {
  const compoundCount = plant.phytochemicals?.length ?? 0;
  const CategoryIcon = categoryMeta[plant.category[0]].icon;

  // Family and parts used are optional fields, shown once curated.
  const facts: { icon: LucideIcon; label: string; value: string }[] = [];
  if (plant.family) facts.push({ icon: GitFork, label: "Family", value: plant.family });
  if (plant.parts_used?.length) {
    facts.push({ icon: Scissors, label: "Parts used", value: plant.parts_used.join(", ") });
  }
  facts.push({
    icon: CategoryIcon,
    label: plant.category.length > 1 ? "Categories" : "Category",
    value: plant.category.map((category) => categoryMeta[category].label).join(", "),
  });
  if (compoundCount > 0) {
    facts.push({ icon: FlaskConical, label: "Compounds", value: `${compoundCount} identified` });
  }
  facts.push({ icon: Database, label: "Data sources", value: getDataSources(citations) });

  return (
    <section className={`${box} bg-bg-secondary`}>
      <h2 className="text-subheading text-ink">Quick Facts</h2>
      <dl className="mt-4 space-y-4">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3.5">
            <Icon className="mt-2 size-4 shrink-0 text-ink-tertiary" aria-hidden />
            <div>
              <dt className="text-overline text-ink-muted uppercase">{label}</dt>
              <dd className="text-[15px] font-medium text-ink">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function EducationalNotice() {
  return (
    <aside className="flex gap-3 rounded-lg border border-warm/30 bg-warm-light p-5">
      <ShieldAlert className="mt-0.5 size-4.5 shrink-0 text-warm" aria-hidden />
      <p className="text-body text-amber-800">
        This information is for educational purposes only. Consult a healthcare provider before using
        any plant for medicinal purposes.
      </p>
    </aside>
  );
}

export function SeverityLegend({ severities }: { severities: CautionSeverity[] }) {
  return (
    <section className={box}>
      <h2 className="text-subheading text-ink">Severity Levels</h2>
      <ul className="mt-4 space-y-3">
        {(["high", "moderate", "low"] as const)
          .filter((severity) => severities.includes(severity))
          .map((severity) => {
            const { label, dot, description } = severityStyles[severity];
            return (
              <li key={severity} className="flex gap-3">
                <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${dot}`} aria-hidden />
                <div>
                  <p className="text-body font-semibold text-ink">{label}</p>
                  <p className="text-body-sm text-ink-tertiary">{description}</p>
                </div>
              </li>
            );
          })}
      </ul>
    </section>
  );
}

export function RelatedPlants({ plants }: { plants: Plant[] }) {
  if (plants.length === 0) return null;
  return (
    <section className={box}>
      <h2 className="text-subheading text-ink">Related Plants</h2>
      <ul className="mt-4 space-y-3">
        {plants.map((plant) => (
          <li key={plant.id}>
            <Link
              href={`/plants/${plant.id}`}
              className="flex items-center gap-3 rounded-md bg-bg-secondary p-3 transition-colors hover:bg-surface"
            >
              <span className="relative size-11 shrink-0 overflow-hidden rounded-sm">
                <PlantPhoto plant={plant} sizes="44px" iconClassName="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium text-ink">{plant.name_common}</span>
                <span className="block truncate text-body-sm text-ink-tertiary italic">
                  {plant.name_scientific}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
