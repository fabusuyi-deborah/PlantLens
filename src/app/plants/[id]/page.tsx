import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CautionsPanel, PhytochemicalsPanel, UsesPanel } from "@/components/plant-detail/panels";
import { PlantTabs } from "@/components/plant-detail/plant-tabs";
import {
  EducationalNotice,
  QuickFacts,
  RelatedPlants,
  SeverityLegend,
} from "@/components/plant-detail/sidebar";
import { PhotoCredit, PlantPhoto } from "@/components/plant-photo";
import { CategoryPill } from "@/components/ui/category-pill";
import { LabeledNameTag } from "@/components/ui/local-name-tag";
import { getPlantCitations } from "@/lib/citations";
import { getAllPlants, getPlantById, getRelatedPlants } from "@/lib/plants";
import type { CautionSeverity } from "@/types/plant";

export function generateStaticParams() {
  return getAllPlants().map((plant) => ({ id: plant.id }));
}

export async function generateMetadata(props: PageProps<"/plants/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const plant = getPlantById(id);
  return plant
    ? {
        title: `${plant.name_common} (${plant.name_scientific}) · PlantLens`,
        description: plant.description,
      }
    : {};
}

export default async function PlantPage(props: PageProps<"/plants/[id]">) {
  const { id } = await props.params;
  const plant = getPlantById(id);
  if (!plant) notFound();

  const citations = getPlantCitations(plant);
  const related = getRelatedPlants(plant);
  const severities = plant.cautions
    .map((caution) => caution.severity)
    .filter((severity): severity is CautionSeverity => Boolean(severity));

  const { yoruba, igbo, hausa, other = [] } = plant.names_local;
  const localNames = [
    { label: "Yoruba", name: yoruba },
    { label: "Igbo", name: igbo },
    { label: "Hausa", name: hausa },
    ...other,
  ].filter((entry): entry is { label: string; name: string } => Boolean(entry.name));

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-border bg-bg-secondary">
        <ol className="mx-auto flex max-w-336 items-center gap-2 px-4 py-2.5 text-body text-ink-tertiary md:px-8">
          {[
            { href: "/", label: "Home" },
            { href: "/explore", label: "Explore" },
          ].map((crumb) => (
            <li key={crumb.href} className="flex items-center gap-2">
              <Link href={crumb.href} className="transition-colors hover:text-ink">
                {crumb.label}
              </Link>
              <ChevronRight className="size-3.5" aria-hidden />
            </li>
          ))}
          <li aria-current="page" className="font-medium text-ink">{plant.name_common}</li>
        </ol>
      </nav>

      <main className="mx-auto max-w-336 px-4 pt-10 pb-16 md:px-8">
        <header className="grid gap-8 md:grid-cols-[minmax(0,480px)_1fr] md:gap-10">
          <figure>
            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
              <PlantPhoto
                plant={plant}
                sizes="(min-width: 768px) 480px, 100vw"
                priority
                iconClassName="size-16"
              />
            </div>
            {plant.photo_credit && (
              <figcaption>
                <PhotoCredit credit={plant.photo_credit} className="mt-2" />
              </figcaption>
            )}
          </figure>
          <div>
            <div className="flex flex-wrap gap-2">
              {plant.category.map((category) => (
                <CategoryPill key={category} category={category} withIcon />
              ))}
            </div>
            <h1 className="mt-5 text-[2rem] leading-tight font-bold tracking-[-0.8px] text-ink sm:text-page-title">
              {plant.name_common}
            </h1>
            <p className="mt-2 text-[17px] text-ink-tertiary italic">{plant.name_scientific}</p>
            <p className="mt-4 text-base leading-relaxed text-ink-secondary">{plant.description}</p>
            {localNames.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-3" aria-label="Local names">
                {localNames.map(({ label, name }) => (
                  <li key={label}>
                    <LabeledNameTag label={label} name={name} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <PlantTabs
            tabs={[
              {
                id: "traditional-uses",
                label: "Traditional Uses",
                content: <UsesPanel plant={plant} citations={citations} />,
              },
              {
                id: "phytochemicals",
                label: "Phytochemicals",
                content: <PhytochemicalsPanel plant={plant} citations={citations} />,
              },
              { id: "cautions", label: "Cautions", content: <CautionsPanel plant={plant} /> },
            ]}
          />

          <aside className="space-y-6">
            <QuickFacts plant={plant} citations={citations} />
            <EducationalNotice />
            {severities.length > 0 && <SeverityLegend severities={severities} />}
            <RelatedPlants plants={related} />
          </aside>
        </div>
      </main>
    </>
  );
}
