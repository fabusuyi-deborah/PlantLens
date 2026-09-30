import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, Database, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { citesDuke, citesNmppdb, getPlantCitations } from "@/lib/citations";
import { getAllPlants } from "@/lib/plants";

export const metadata: Metadata = {
  title: "Data Sources · PlantLens",
  description: "The databases and published literature behind every PlantLens entry.",
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
    <main className="mx-auto max-w-336 px-4 pt-10 pb-16 md:px-8">
      <PageHeader
        title="Data Sources"
        subtitle="Every use, compound and caution on PlantLens is tied to a source. Here's where the data comes from and how it's put together."
      />

      <section className="mt-10 grid gap-5 md:grid-cols-3">
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
        <SourceCard
          icon={BookOpen}
          title="Published literature"
          kicker="Journals, reviews and monographs"
          body="Peer-reviewed studies, review articles and regulatory monographs fill in what the databases don't cover, especially cautions and clinical findings."
          stat={`${literatureCount} references cited`}
        />
      </section>

      <section className="mt-16">
        <h2 className="text-section text-ink">How the data is put together</h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-md bg-bg-secondary p-6">
              <span className="text-caption text-accent uppercase">Step {i + 1}</span>
              <h3 className="mt-2 text-subheading text-ink">{step.title}</h3>
              <p className="mt-2 text-body text-ink-secondary">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
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
}: {
  icon: LucideIcon;
  title: string;
  kicker: string;
  body: string;
  stat: string;
  link?: { href: string; label: string };
}) {
  return (
    <article className="flex flex-col rounded-lg border border-border p-6">
      <span className="flex size-11 items-center justify-center rounded-sm bg-accent-light">
        <Icon className="size-5 text-accent" aria-hidden />
      </span>
      <h3 className="mt-5 text-card-heading text-ink">{title}</h3>
      <p className="text-body-sm text-ink-tertiary">{kicker}</p>
      <p className="mt-3 flex-1 text-body text-ink-secondary">{body}</p>
      <p className="mt-5 text-body-sm font-semibold text-ink">{stat}</p>
      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 border-t border-border-light pt-3 text-body font-medium text-accent transition-colors hover:text-accent-dark"
        >
          {link.label}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      )}
    </article>
  );
}
