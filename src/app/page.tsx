import Link from "next/link";
import { ArrowRight, Database, FlaskConical, Languages } from "lucide-react";
import { PlantCard } from "@/components/plant-card";
import { SearchInput } from "@/components/ui/search-input";
import { categoryMeta } from "@/lib/categories";
import { getCategoryCounts, getDatasetStats, getPlantsByIds } from "@/lib/plants";

const featuredIds = ["bitter-leaf", "moringa", "scent-leaf", "neem"];

const researchPoints = [
  {
    icon: Database,
    title: "Curated Data",
    body: "Sourced from Dr. Duke's USDA database, NMPPDB — Nigeria's own medicinal plant database — and peer-reviewed studies.",
  },
  {
    icon: Languages,
    title: "Local Names",
    body: "Yoruba, Igbo, and Hausa names cross-checked with NMPPDB's species records.",
  },
  {
    icon: FlaskConical,
    title: "Real Chemistry",
    body: "Phytochemical compounds with associated biological activities and literature citations.",
  },
];

export default function Home() {
  const featured = getPlantsByIds(featuredIds);
  const categories = getCategoryCounts();
  const stats = getDatasetStats();

  return (
    <main>
      {/* Hero */}
      <section className="px-4 pt-16 pb-14 text-center md:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-body-sm font-medium text-ink-secondary">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          Powered by real phytochemical research
        </span>
        <h1 className="mt-6 text-[2.5rem] leading-tight font-bold tracking-[-1px] text-ink sm:text-display">
          Discover Nigeria&apos;s Plants
        </h1>
        <p className="mx-auto mt-6 max-w-140 text-lg leading-relaxed text-ink-secondary">
          Search local names, traditional uses, and real phytochemical data for Nigerian plants.
        </p>
        <SearchInput className="mx-auto mt-8 max-w-150 text-left" />
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-body-sm text-ink-muted">Popular:</span>
          {featured.map((plant) => (
            <Link
              key={plant.id}
              href={`/plants/${plant.id}`}
              className="rounded-full bg-surface px-3 py-1 text-body-sm font-medium text-ink-secondary transition-colors hover:bg-border hover:text-ink"
            >
              {plant.name_common}
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-bg-secondary">
        <dl className="mx-auto grid max-w-3xl grid-cols-2 gap-6 px-4 py-6 text-center sm:grid-cols-4">
          <Stat value={stats.plants} label="Curated Plants" />
          <Stat value={stats.compounds} label="Phytochemicals" />
          <Stat value={stats.languages} label="Local Languages" />
          <Stat value={stats.citations} label="Research Citations" />
        </dl>
      </section>

      {/* Featured plants */}
      <section className="mx-auto max-w-336 px-4 py-16 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            title="Featured Plants"
            subtitle="Well-documented species with rich phytochemical profiles"
          />
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-body font-medium text-accent transition-colors hover:text-accent-dark"
          >
            View all plants <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((plant) => (
            <li key={plant.id}>
              <PlantCard plant={plant} />
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section className="bg-bg-secondary">
        <div className="mx-auto max-w-336 px-4 py-16 md:px-8">
          <SectionHeading
            title="Browse by Category"
            subtitle="Explore plants by their primary use and classification"
          />
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map(({ category, count }) => {
              const { icon: Icon, pluralLabel, text, bg } = categoryMeta[category];
              return (
                <li key={category}>
                  <Link
                    href={`/explore?category=${category}`}
                    className="block h-full rounded-md border border-border bg-bg-elevated p-5 transition hover:border-ink-muted/50 hover:shadow-[0_4px_16px_rgba(10,37,64,0.06)]"
                  >
                    <span className={`flex size-10 items-center justify-center rounded-sm ${bg}`}>
                      <Icon className={`size-5 ${text}`} aria-hidden />
                    </span>
                    <h3 className="mt-4 text-subheading text-ink">{pluralLabel}</h3>
                    <p className="text-body-sm text-ink-tertiary">
                      {count} {count === 1 ? "plant" : "plants"}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Research */}
      <section className="mx-auto max-w-336 px-4 py-16 md:px-8">
        <div className="text-center">
          <h2 className="text-section text-ink">Built on Real Research</h2>
          <p className="mx-auto mt-5 max-w-md text-body-lg text-ink-secondary">
            Every data point cites its source: a phytochemical or ethnobotanical database, or a
            peer-reviewed study.
          </p>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {researchPoints.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="rounded-md border border-border p-7">
              <div className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-sm bg-accent-light">
                  <Icon className="size-5 text-accent" aria-hidden />
                </span>
                <span className="text-[40px] leading-none font-bold text-border" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 text-subheading text-ink">{title}</h3>
              <p className="mt-3 text-body text-ink-secondary">{body}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-section text-ink">{title}</h2>
      <p className="mt-1 text-body text-ink-secondary">{subtitle}</p>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="text-body-sm text-ink-tertiary">{label}</dt>
      <dd className="text-[28px] leading-tight font-bold text-ink">{value}</dd>
    </div>
  );
}
