import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getDatasetStats } from "@/lib/plants";

export const metadata: Metadata = {
  title: "About · PlantLens",
  description: "Why PlantLens exists and what's in it.",
};

export default function AboutPage() {
  const stats = getDatasetStats();

  return (
    <main className="mx-auto max-w-3xl px-4 pt-10 pb-16 md:px-8">
      <PageHeader
        title="About PlantLens"
        subtitle="Nigeria's plant knowledge, backed by science."
      />

      <div className="mt-10 space-y-12">
        <Section title="Why PlantLens">
          <p>
            Bitter leaf, scent leaf, moringa, zobo: these plants are in Nigerian kitchens, gardens and
            markets every day, and most of us grew up hearing what they&apos;re &ldquo;good for&rdquo;.
            But that knowledge usually travels by word of mouth, under a local name, with no way to
            check it.
          </p>
          <p>
            PlantLens brings it together in one place. Each plant has its Yoruba, Igbo and Hausa names
            alongside its scientific name, its traditional uses, the compounds it contains and the
            cautions worth knowing, and every one of those claims is linked to a source.
          </p>
        </Section>

        <Section title="What's inside">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: stats.plants, label: "Plants" },
              { value: stats.compounds, label: "Phytochemicals" },
              { value: stats.languages, label: "Local languages" },
              { value: stats.citations, label: "Citations" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse rounded-md bg-bg-secondary p-4">
                <dt className="text-body-sm text-ink-tertiary">{stat.label}</dt>
                <dd className="text-[28px] leading-tight font-bold text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <p>
            The data comes from Dr. Duke&apos;s USDA database, NMPPDB and published literature, and is
            curated by hand.{" "}
            <Link href="/sources" className="font-medium text-accent hover:text-accent-dark">
              See how it&apos;s sourced
            </Link>
            .
          </p>
        </Section>

        <Section title="What PlantLens is not">
          <aside className="flex gap-3 rounded-lg border border-warm/30 bg-warm-light p-5 text-amber-800">
            <ShieldAlert className="mt-0.5 size-4.5 shrink-0 text-warm" aria-hidden />
            <p>
              PlantLens is not medical advice. It records how plants are traditionally used and what
              studies have found, not what you should take. Talk to a healthcare professional before
              using any plant as a treatment, especially if you are pregnant, breastfeeding or on
              medication.
            </p>
          </aside>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-section text-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-body-lg text-ink-secondary">{children}</div>
    </section>
  );
}
