import type { Metadata } from "next";
import Image from "next/image";
import { Leaf, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { GithubIcon, HashnodeIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { WaveBand } from "@/components/ui/wave-band";
import { getDatasetStats } from "@/lib/plants";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About · PlantLens",
  description:
    "Why PlantLens exists, how its data is gathered, and who curates it.",
};

const pillars = [
  {
    title: "Preserve traditional knowledge",
    body: "Document the ethnobotanical knowledge shared across Africa's diverse communities.",
    color: "bg-pink",
  },
  {
    title: "Bridge science and tradition",
    body: "Connect traditional plant uses with phytochemical research and published sources.",
    color: "bg-lavender",
  },
  {
    title: "Open access for all",
    body: "Make plant data freely available to researchers, students and curious minds.",
    color: "bg-yellow",
  },
  {
    title: "Community-driven",
    body: "Bring together botanical research and knowledge rooted in communities across Africa.",
    color: "bg-mint",
  },
];

const steps = [
  { title: "Source", body: "We draw from NMPPDB, Dr. Duke's database and published ethnobotanical literature." },
  { title: "Normalize", body: "Plant names, compounds and uses are cleaned, cross-referenced and standardized." },
  {
    title: "Review",
    body: "Entries are checked against their cited sources, with evidence and context kept alongside the data.",
  },
];

const socials = [
  { label: "GitHub", href: site.curator.github, Icon: GithubIcon },
  { label: "LinkedIn", href: site.curator.linkedin, Icon: LinkedinIcon },
  { label: "X", href: site.curator.x, Icon: XIcon },
  { label: "Hashnode", href: site.curator.hashnode, Icon: HashnodeIcon },
];

export default function AboutPage() {
  const stats = getDatasetStats();

  return (
    <main>
      <PageHeader
        title="Making African plant knowledge accessible to everyone"
        subtitle="PlantLens curates phytochemical data, local names and traditional uses for African plants, starting with Nigeria, backed by scientific research and open databases."
      />

      <WaveBand tone="green" className="my-3" aria-labelledby="why-title">
        <div className="mx-auto max-w-300 px-4 pt-14 pb-16 md:px-8">
          <h2 id="why-title" className="mb-7 font-display text-[clamp(1.75rem,3.6vw,2.625rem)] font-medium">
            Why PlantLens exists
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <li key={pillar.title} className={`flex flex-col gap-2.5 rounded-[20px] p-6 text-ink ${pillar.color}`}>
                <h3 className="font-display text-xl leading-[1.15] font-medium text-green">{pillar.title}</h3>
                <p className="text-[0.9375rem]">{pillar.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </WaveBand>

      <section aria-labelledby="curator-title" className="mx-auto max-w-300 px-4 py-18 md:px-8">
        <div className="grid items-center gap-6 rounded-hero border border-line bg-paper p-6 md:grid-cols-[260px_minmax(0,1fr)] md:gap-10 md:p-9">
          <div className="flex flex-col items-center gap-6.5">
            <figure className="relative w-45 md:w-65">
              <Image
                src="/curator.jpg"
                alt="Portrait of Deborah Fabusuyi"
                width={800}
                height={1000}
                sizes="(min-width: 768px) 260px, 180px"
                className="aspect-4/5 w-full rounded-t-[140px] rounded-b-3xl bg-pink object-cover"
              />
              <span
                className="absolute -right-2 -bottom-2 flex size-11.5 items-center justify-center rounded-full bg-yellow text-green shadow-[0_8px_16px_-10px_rgba(0,0,0,0.5)] md:-right-3 md:-bottom-3 md:size-14.5"
                aria-hidden
              >
                <Leaf className="size-6 md:size-8" strokeWidth={1.8} />
              </span>
            </figure>
            <ul className="flex justify-center gap-3" aria-label="Deborah online">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Deborah on ${label}`}
                    title={label}
                    className="inline-flex size-11 items-center justify-center rounded-full border-[1.5px] border-green text-green transition-[background-color,color,transform] hover:-translate-y-0.5 hover:bg-green hover:text-paper"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            <p className="text-overline text-ink-secondary uppercase">Meet the curator</p>
            <h2
              id="curator-title"
              className="font-display text-[clamp(1.875rem,3.6vw,2.75rem)] leading-[1.05] font-medium tracking-[-0.02em] text-green"
            >
              Deborah Fabusuyi
            </h2>
            <p className="text-[0.8125rem] font-bold tracking-[0.12em] text-purple uppercase">
              Plant biology graduate · Frontend engineer
            </p>
            <p className="max-w-[40em]">
              Deborah studied Plant Biology at the University of Ilorin, where her final-year research in
              ethnobotany looked at the chemistry of mango leaf, <i>Mangifera indica</i>. She now builds
              for the web as a frontend engineer, and PlantLens is where the two meet.
            </p>
            <p className="max-w-[40em]">
              PlantLens is curated, not original research. Deborah gathers what databases and published
              studies already say about African plants, checks local names against their sources,
              rewrites it in plain language, and credits every claim back to the researchers who did the
              work.
            </p>
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {[
                ["B.Sc. Plant Biology, University of Ilorin", "bg-pink"],
                ["Ethnobotany", "bg-yellow"],
                ["Frontend engineering", "bg-lavender"],
              ].map(([label, color]) => (
                <li
                  key={label}
                  className={`inline-flex min-h-5.5 items-center rounded-full px-2.5 text-[0.65625rem] font-bold tracking-[0.08em] uppercase ${color}`}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="powers-title" className="mx-auto max-w-300 px-4 pb-18 md:px-8">
        <SectionHeading
          id="powers-title"
          title="What Powers PlantLens"
          subtitle="Every data point is sourced from phytochemical databases, ethnobotanical research and published literature."
        />
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            [stats.plants, "curated plants", "bg-pink"],
            [stats.compounds, "phytochemicals", "bg-lavender"],
            [stats.languages, "local languages", "bg-yellow"],
            [stats.citations, "research citations", "bg-mint"],
          ].map(([value, label, color]) => (
            <div key={label} className={`flex flex-col-reverse rounded-[18px] p-4.5 text-center ${color}`}>
              <dt className="text-caption font-bold tracking-widest uppercase">{label}</dt>
              <dd className="font-display text-[2.5rem] leading-none font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        <ol className="mt-7 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-2 rounded-[20px] border border-line bg-paper p-5.5">
              <span className="font-display text-[0.9375rem] font-semibold text-purple">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl font-medium text-green">{step.title}</h3>
              <p className="text-[0.9375rem] text-ink-secondary">{step.body}</p>
            </li>
          ))}
        </ol>
        <div role="note" className="mt-5.5 flex gap-3 rounded-[18px] bg-warm-light px-5 py-4.5 text-[#6b4a00]">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warm" aria-hidden />
          <p>
            PlantLens is not medical advice. It documents traditional uses and research findings, not
            what you should take. Consult a healthcare professional before using any plant as treatment,
            especially during pregnancy, breastfeeding, or while taking medication.
          </p>
        </div>
      </section>
    </main>
  );
}
