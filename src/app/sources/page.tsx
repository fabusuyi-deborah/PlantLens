import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Database,
  type LucideIcon,
} from "lucide-react";
import { PhotoCredit } from "@/components/plant-photo";
import { citesDuke, citesNmppdb, getPlantCitations } from "@/lib/citations";
import { getAllPlants } from "@/lib/plants";

export const metadata: Metadata = {
  title: "Data Sources · PlantLens",
  description:
    "The databases and published literature behind every PlantLens entry.",
};

const steps = [
  {
    title: "Pull from Dr. Duke's",
    body: "A script matches each plant to Dr. Duke's database by genus and species, then extracts every recorded phytochemical and traditional use.",
  },
  {
    title: "Cross-check with NMPPDB",
    body: "Local Yoruba, Igbo and Hausa names and Nigerian uses are checked against NMPPDB's species records and the studies they cite.",
  },
  {
    title: "Curate by hand",
    body: "The raw rows are narrowed down to the compounds and uses worth including, and rewritten in plain language.",
  },
  {
    title: "Cite every claim",
    body: "Each use, compound and caution keeps its source citation. Wording stays descriptive: “traditionally used for”, never a medical claim.",
  },
];

export default function SourcesPage() {
  const plants = getAllPlants();
  const photographed = plants.filter((plant) => plant.photo_credit);
  const citations = new Set(plants.flatMap(getPlantCitations));
  const countPlantsCiting = (test: (citation: string) => boolean) =>
    plants.filter((plant) => getPlantCitations(plant).some(test)).length;

  const databases = [
    {
      name: "NMPPDB",
      fullName: "Nigerian Medicinal Plants and Phytochemicals Database",
      body: "Nigeria's own medicinal plant database, with local names, species records and references to Nigerian ethnobotanical studies.",
      href: "https://nmppdb.com.ng",
      host: "nmppdb.com.ng",
      plantCount: countPlantsCiting(citesNmppdb),
    },
    {
      name: "Dr. Duke's",
      fullName: "Phytochemical and Ethnobotanical Databases (USDA)",
      body: "James A. Duke's long-running USDA database of plant chemicals, their biological activities and recorded traditional uses. Released under CC0.",
      href: "https://phytochem.nal.usda.gov",
      host: "phytochem.nal.usda.gov",
      plantCount: countPlantsCiting(citesDuke),
    },
  ];
  const literatureCount = [...citations].filter(
    (citation) => !citesNmppdb(citation) && !citesDuke(citation),
  ).length;

  return (
    <main className="mx-auto max-w-[1344px] px-4 pt-8 pb-10 md:px-8">
      <header className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-overline text-accent-dark">
          <Database className="size-3" aria-hidden />
          Data Sources
        </span>
        <h1 className="mx-auto mt-3 text-[2rem] leading-tight font-bold tracking-[-0.8px] text-ink sm:text-page-title">
          Our Data Sources
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-body-lg text-ink-secondary">
          PlantLens brings together database records and published
          ethnobotanical research.
        </p>
      </header>

      <section className="mt-7">
        <SectionHeading>Primary Databases</SectionHeading>
        <div className="mt-3 grid gap-3">
          {databases.map((db) => (
            <SourceCard
              key={db.name}
              icon={Database}
              title={db.name}
              kicker={db.fullName}
              body={db.body}
              stat={`Cited on ${db.plantCount} of ${plants.length} plants`}
              link={{ href: db.href, label: db.host }}
            />
          ))}
        </div>
      </section>

      <section className="mt-7">
        <SectionHeading>Supplementary &amp; Literature Sources</SectionHeading>
        <SourceCard
          className="mt-3"
          icon={BookOpen}
          title="Published Ethnobotanical Literature"
          kicker="Peer-reviewed journals and published research"
          body="Published studies provide evidence for traditional uses and phytochemical findings that are not covered by the databases."
          stat={`${literatureCount} references cited`}
        />
      </section>

      <section className="mt-7">
        <SectionHeading>How We Handle Data</SectionHeading>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-md border border-border bg-bg-secondary p-4"
            >
              <span className="text-overline text-accent">Step {i + 1}</span>
              <h3 className="mt-1 text-subheading text-ink">{step.title}</h3>
              <p className="mt-1 text-body-sm text-ink-secondary">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>
      {photographed.length > 0 && (
        <details id="photo-credits" className="group mt-7 rounded-md border border-border px-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-body font-medium text-ink marker:hidden">
            <span>Photo credits ({photographed.length} plants)</span>
            <ChevronDown
              className="size-4 shrink-0 text-ink-secondary transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <p className="border-t border-border pt-3 text-body-sm text-ink-secondary">
            Plant photos come from Wikimedia Commons and iNaturalist, used under
            their Creative Commons or public domain licenses.
          </p>
          <ul className="grid gap-x-8 py-2 sm:grid-cols-2 lg:grid-cols-3">
            {photographed.map((plant) => (
              <li key={plant.id} className="border-b border-border-light py-2">
                <Link
                  href={`/plants/${plant.id}`}
                  className="text-body-sm font-medium text-ink transition-colors hover:text-accent"
                >
                  {plant.name_common}
                </Link>
                <PhotoCredit credit={plant.photo_credit} />
              </li>
            ))}
          </ul>
        </details>
      )}
    </main>
  );
}

function SourceCard({
  icon: Icon,
  title,
  kicker,
  body,
  stat,
  link,
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  kicker: string;
  body: string;
  stat: string;
  link?: { href: string; label: string };
  className?: string;
}) {
  return (
    <article className={`rounded-md border border-border p-3.5 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-accent-light">
          <Icon className="size-4 text-accent" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <div>
              <h3 className="text-subheading text-ink">{title}</h3>
              <p className="text-body-sm text-ink-tertiary">{kicker}</p>
            </div>
            <p className="text-body-sm font-medium text-ink-secondary">
              {stat}
            </p>
          </div>
          <p className="mt-2 text-body-sm text-ink-secondary">{body}</p>
          {link && (
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-body-sm font-medium text-accent transition-colors hover:text-accent-dark"
            >
              {link.label}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-subheading text-ink">
      <span className="size-1.5 rounded-full bg-accent" aria-hidden />
      {children}
    </h2>
  );
}
