import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { OpenOnHash } from "@/components/open-on-hash";
import { PageHeader } from "@/components/page-header";
import { PhotoCredit } from "@/components/plant-photo";
import { citesDuke, citesNmppdb, getPlantCitations } from "@/lib/citations";
import { getAllPlants } from "@/lib/plants";

export const metadata: Metadata = {
  title: "Data Sources · PlantLens",
  description: "The databases and published literature behind every PlantLens entry, and photo credits.",
};

const steps = [
  {
    title: "Pull from Dr. Duke's",
    body: "A script matches each plant to Dr. Duke's database by genus and species, then extracts every recorded phytochemical and traditional use.",
  },
  {
    title: "Cross-check names and range",
    body: "Yoruba, Igbo and Hausa names and Nigerian uses are checked against NMPPDB. Names in other African languages start from leads such as Wikidata and are only added once confirmed in a published reference. Where each plant grows comes from Kew's Plants of the World Online.",
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
  const withRegionsSource = plants.filter((plant) => plant.regions_source).length;
  const nameLanguages = new Set(plants.flatMap((plant) => plant.names_local.map((entry) => entry.language)));
  const nameCount = plants.reduce((total, plant) => total + plant.names_local.length, 0);
  const unverifiedNames = plants.reduce(
    (total, plant) => total + plant.names_local.filter((entry) => entry.verified === false).length,
    0,
  );
  const literatureCount = [...citations].filter((c) => !citesNmppdb(c) && !citesDuke(c)).length;

  return (
    <main>
      <PageHeader
        title="Our data sources"
        subtitle="PlantLens brings together database records and published ethnobotanical research."
      />

      <div className="mx-auto max-w-300 px-4 pt-2 pb-18 md:px-8">
        <SubHeading>Primary databases</SubHeading>
        <div className="grid gap-4.5 md:grid-cols-2">
          <SourceCard
            title="NMPPDB"
            kicker="Nigerian Medicinal Plants and Phytochemicals Database"
            body="Nigeria's own medicinal plant database, with local names, species records and references to Nigerian ethnobotanical studies."
            stat={`Cited on ${countPlantsCiting(citesNmppdb)} of ${plants.length} plants`}
            href="https://nmppdb.com.ng"
            color="bg-pink"
          />
          <SourceCard
            title="Dr. Duke's"
            kicker="Phytochemical and Ethnobotanical Databases (USDA)"
            body="James A. Duke's long-running USDA database of plant chemicals, their biological activities and recorded traditional uses. Released under CC0."
            stat={`Cited on ${countPlantsCiting(citesDuke)} of ${plants.length} plants`}
            href="https://phytochem.nal.usda.gov"
            color="bg-lavender"
          />
        </div>

        <SubHeading className="mt-11">Supplementary &amp; literature sources</SubHeading>
        <div className="grid gap-4.5 md:grid-cols-2">
          <SourceCard
            title="Published ethnobotanical literature"
            kicker="Peer-reviewed journals and published research"
            body="Published studies provide evidence for traditional uses and phytochemical findings that are not covered by the databases."
            stat={`${literatureCount} references cited`}
            color="bg-yellow"
          />
          <SourceCard
            title="Plants of the World Online"
            kicker="Royal Botanic Gardens, Kew"
            body="Kew's record of where each species grows, native or naturalised. It decides which parts of Africa a plant is listed in."
            stat={`Regions for ${withRegionsSource} of ${plants.length} plants`}
            href="https://powo.science.kew.org"
            color="bg-mint"
          />
          <SourceCard
            title="Local names"
            kicker="NMPPDB, Wikidata and regional plant references"
            body={`Nigerian names come from NMPPDB. Names in Swahili, Akan (Twi), Fula and other languages start from leads such as Wikidata and are only added once confirmed in references such as PROTA4U, the World Agroforestry Agroforestree Database, Burkill's Useful Plants of West Tropical Africa and the Akan (Twi) Dictionary.${
              unverifiedNames > 0
                ? ` Until then they're marked "not yet verified" on each plant (${unverifiedNames} of ${nameCount} names).`
                : ""
            }`}
            stat={`${nameCount} names in ${nameLanguages.size} languages`}
            color="bg-lavender"
          />
        </div>

        <SubHeading className="mt-11">How we handle data</SubHeading>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-2 rounded-[20px] border border-line bg-paper p-5.5">
              <span className="font-display text-[0.9375rem] font-semibold text-purple">Step {i + 1}</span>
              <h3 className="font-display text-xl font-medium text-green">{step.title}</h3>
              <p className="text-[0.9375rem] text-ink-secondary">{step.body}</p>
            </li>
          ))}
        </ol>

        {photographed.length > 0 && (
          <details id="photo-credits" className="group mt-11 scroll-mt-24 rounded-[20px] border border-line bg-paper px-5.5">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 font-display text-[1.375rem] text-green [&::-webkit-details-marker]:hidden">
              <span>
                Photo credits{" "}
                <span className="font-sans text-[0.9375rem] text-ink-secondary">({photographed.length} plants)</span>
              </span>
              <ChevronDown className="size-6 shrink-0 transition-transform duration-250 group-open:rotate-180" aria-hidden />
            </summary>
            <p className="mb-2 text-ink-secondary">
              Plant photos come from Wikimedia Commons and iNaturalist, used under their Creative Commons or
              public domain licences.
            </p>
            <ul className="grid gap-x-7 pb-4.5 sm:grid-cols-2 lg:grid-cols-3">
              {photographed.map((plant) => (
                <li key={plant.id} className="flex min-w-0 flex-col gap-0.5 border-t border-line py-3 break-words">
                  <Link
                    href={`/plants/${plant.id}`}
                    className="inline-flex items-center gap-2.5 text-[0.9375rem] font-semibold transition-colors hover:text-purple"
                  >
                    {plant.photo_url && (
                      <Image src={plant.photo_url} alt="" width={34} height={34} className="size-8.5 rounded-lg object-cover" />
                    )}
                    {plant.name_common}
                  </Link>
                  <PhotoCredit credit={plant.photo_credit} />
                </li>
              ))}
            </ul>
          </details>
        )}
        <OpenOnHash id="photo-credits" />
      </div>
    </main>
  );
}

function SubHeading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`mb-4 flex items-center gap-2.5 font-display text-[1.375rem] font-medium text-green ${className}`}>
      <span className="size-2.5 rounded-full bg-yellow" aria-hidden />
      {children}
    </h2>
  );
}

function SourceCard({
  title,
  kicker,
  body,
  stat,
  href,
  color,
}: {
  title: string;
  kicker: string;
  body: string;
  stat: string;
  href?: string;
  color: string;
}) {
  return (
    <article className="flex gap-4 rounded-[20px] border border-line bg-paper p-4.5 sm:p-6">
      <span className={`mt-2 size-3.5 shrink-0 rounded-full ${color}`} aria-hidden />
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3.5 gap-y-1.5">
          <div>
            <h3 className="font-display text-[1.375rem] font-medium text-green">{title}</h3>
            <p className="mt-0.5 text-body-sm text-ink-secondary">{kicker}</p>
          </div>
          <span className={`inline-flex min-h-5.5 items-center rounded-full px-2.5 text-[0.65625rem] font-bold tracking-[0.08em] uppercase ${color}`}>
            {stat}
          </span>
        </div>
        <p className="mt-1">{body}</p>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 self-start border-b-2 border-yellow pb-0.5 text-caption font-bold tracking-[0.14em] text-green uppercase"
          >
            {href.replace("https://", "")} ↗
          </a>
        )}
      </div>
    </article>
  );
}
