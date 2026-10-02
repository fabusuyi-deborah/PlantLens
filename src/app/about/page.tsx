import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Database,
  FlaskConical,
  Globe,
  Info,
  Languages,
  Leaf,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import { getDatasetStats } from "@/lib/plants";

export const metadata: Metadata = {
  title: "About · PlantLens",
  description: "Why PlantLens exists and what's in it.",
};

const missionPillars = [
  {
    icon: BookOpen,
    title: "Preserve Traditional Knowledge",
    body: "Document the ethnobotanical knowledge shared across Nigeria's diverse communities.",
  },
  {
    icon: FlaskConical,
    title: "Bridge Science & Tradition",
    body: "Connect traditional plant uses with phytochemical research and published sources.",
  },
  {
    icon: Globe,
    title: "Open Access for All",
    body: "Make plant data freely available to researchers, students, and curious minds.",
  },
  {
    icon: UsersRound,
    title: "Community-Driven",
    body: "Bring together botanical research and knowledge rooted in communities across Nigeria.",
  },
];

const dataSteps = [
  {
    title: "Source",
    body: "We draw from NMPPDB, Dr. Duke's database, and published ethnobotanical literature.",
  },
  {
    title: "Normalize",
    body: "Plant names, compounds, and uses are cleaned, cross-referenced, and standardized.",
  },
  {
    title: "Review",
    body: "Entries are checked against their cited sources, with evidence and context kept alongside the data.",
  },
];

export default function AboutPage() {
  const stats = getDatasetStats();

  return (
    <main>
      <section className="px-4 py-10 text-center md:py-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-overline text-accent-dark">
          <Info className="size-3" aria-hidden />
          About PlantLens
        </span>
        <h1 className="mx-auto mt-3 max-w-3xl text-[2rem] leading-tight font-bold tracking-[-0.8px] text-ink sm:text-page-title">
          Making Nigerian Plant Knowledge Accessible to Everyone
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-body-lg text-ink-secondary">
          PlantLens curates phytochemical data, local names, and traditional
          uses for Nigerian plants, backed by scientific research and open
          databases.
        </p>
      </section>

      <section className="bg-bg-secondary px-4 py-8 md:py-10">
        <div className="mx-auto max-w-[1344px] md:px-4">
          <p className="text-overline text-accent">Our Mission</p>
          <h2 className="mt-1 text-section text-ink">Why PlantLens Exists</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {missionPillars.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="rounded-md border border-border bg-bg-elevated p-4"
              >
                <span className="flex size-8 items-center justify-center rounded-sm bg-accent-light">
                  <Icon className="size-4 text-accent" aria-hidden />
                </span>
                <h3 className="mt-3 text-subheading text-ink">{title}</h3>
                <p className="mt-2 text-body-sm text-ink-secondary">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1344px] px-4 py-8 md:px-8 md:py-10">
        <p className="text-overline text-accent">The Data</p>
        <h2 className="mt-1 text-section text-ink">What Powers PlantLens</h2>
        <p className="mt-1 max-w-2xl text-body-sm text-ink-secondary">
          Every data point is sourced from phytochemical databases,
          ethnobotanical research, and published literature.
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={Leaf} value={stats.plants} label="Curated Plants" />
          <Stat
            icon={FlaskConical}
            value={stats.compounds}
            label="Phytochemicals"
          />
          <Stat
            icon={Languages}
            value={stats.languages}
            label="Nigerian Languages"
          />
          <Stat
            icon={Database}
            value={stats.citations}
            label="Research Citations"
          />
        </dl>

        <ol className="mt-4 grid gap-4 rounded-md border border-border bg-bg-secondary p-4 sm:grid-cols-3">
          {dataSteps.map(({ title, body }, index) => (
            <li key={title}>
              <span
                className="text-section font-bold text-accent/30"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 text-body font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-body-sm text-ink-secondary">{body}</p>
            </li>
          ))}
        </ol>

        <aside className="mt-4 flex gap-2 rounded-md border border-warm/30 bg-warm-light p-3 text-body-sm text-amber-800">
          <ShieldAlert
            className="mt-0.5 size-4 shrink-0 text-warm"
            aria-hidden
          />
          <p>
            PlantLens is not medical advice. It documents traditional uses and
            research findings, not what you should take. Consult a healthcare
            professional before using any plant as treatment, especially during
            pregnancy, breastfeeding, or while taking medication.
          </p>
        </aside>
      </section>

      <section className="bg-accent px-4 py-8 text-center text-white md:py-10">
        <h2 className="text-section font-bold">Start Exploring</h2>
        <p className="mx-auto mt-2 max-w-lg text-body-sm text-white/85">
          Explore Nigerian plants, phytochemicals, and traditional knowledge.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 rounded-sm bg-white px-4 py-2 text-body-sm font-medium text-accent-dark transition-colors hover:bg-accent-light"
          >
            Explore Plants <ArrowRight className="size-3.5" aria-hidden />
          </Link>
          <Link
            href="/sources"
            className="inline-flex items-center rounded-sm border border-white/70 px-4 py-2 text-body-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            View Sources
          </Link>
        </div>
      </section>
    </main>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Leaf;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-md border border-border bg-bg-secondary p-3 text-center">
      <span className="flex size-8 items-center justify-center rounded-full bg-accent-light">
        <Icon className="size-4 text-accent" aria-hidden />
      </span>
      <dd className="mt-1 text-section font-bold text-ink">{value}</dd>
      <dt className="text-body-sm text-ink-tertiary">{label}</dt>
    </div>
  );
}
