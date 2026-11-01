import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, PencilLine, ShieldAlert } from "lucide-react";
import { PhotoCard } from "@/components/home/plant-cards";
import { CitationProvider } from "@/components/plant-detail/citations";
import {
  CautionList,
  CompoundGrid,
  SayItIn,
  SourceList,
  UsesList,
} from "@/components/plant-detail/sections";
import { SeverityPill, severityStyles } from "@/components/plant-detail/severity";
import { CategoryPill } from "@/components/ui/category-pill";
import { SectionHeading } from "@/components/ui/section-heading";
import { WaveBand } from "@/components/ui/wave-band";
import { categoryMeta } from "@/lib/categories";
import { getDataSources } from "@/lib/citations";
import { getPlantProfile, getSuggestedPlants } from "@/lib/plant-profile";
import { getAllPlants, getPlantById } from "@/lib/plants";
import { site } from "@/lib/site";

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
        openGraph: {
          type: "article",
          siteName: "PlantLens",
          title: `${plant.name_common} · ${plant.name_scientific}`,
          description: plant.description,
          images: plant.photo_url ? [{ url: plant.photo_url, alt: plant.name_common }] : undefined,
        },
      }
    : {};
}

const sectionHeading = "font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-medium tracking-[-0.02em]";

export default async function PlantPage(props: PageProps<"/plants/[id]">) {
  const { id } = await props.params;
  const plant = getPlantById(id);
  if (!plant) notFound();

  const { uses, compounds, cautions, names, refs } = getPlantProfile(plant);
  const suggested = getSuggestedPlants(plant);
  const credit = plant.photo_credit;
  const severities = (["high", "moderate", "low"] as const).filter((severity) =>
    cautions.some((caution) => caution.severity === severity),
  );
  const jumpLinks = [
    { href: "#uses", label: "Uses", count: uses.length },
    { href: "#compounds", label: "Compounds", count: compounds.length },
    { href: "#cautions", label: "Cautions", count: cautions.length },
    { href: "#sources", label: "Sources", count: refs.length },
  ];

  return (
    <main>
      <WaveBand tone="green" className="mt-4.5" aria-labelledby="plant-name">
        <div className="mx-auto grid max-w-300 items-center gap-8 px-4 pt-7 pb-9 md:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
          <figure>
            <div className="relative aspect-[4/3.1] overflow-hidden rounded-[18px] bg-green-dark">
              {plant.photo_url && (
                <Image
                  src={plant.photo_url}
                  alt={`${plant.name_common}, ${plant.name_scientific}`}
                  fill
                  sizes="(min-width: 1024px) 620px, 100vw"
                  loading="eager"
                  fetchPriority="high"
                  className="object-cover"
                />
              )}
            </div>
            {credit && (
              <figcaption className="mt-2 text-xs opacity-80">
                <a href={credit.source_url} target="_blank" rel="noreferrer" className="underline">
                  Photo
                </a>{" "}
                by {credit.author} · {credit.license}
              </figcaption>
            )}
          </figure>

          <div>
            <nav aria-label="Breadcrumb" className="mb-3.5 text-caption font-bold tracking-[0.12em] uppercase opacity-85">
              <ol className="flex flex-wrap gap-1.5">
                <li>
                  <Link href="/" className="hover:text-yellow">Home</Link> /
                </li>
                <li>
                  <Link href="/explore" className="hover:text-yellow">Plants</Link> /
                </li>
                <li aria-current="page">{plant.name_common}</li>
              </ol>
            </nav>
            <div className="flex flex-wrap gap-1.5">
              {plant.category.map((category) => (
                <CategoryPill key={category} category={category} />
              ))}
            </div>
            <h1
              id="plant-name"
              className="mt-3.5 font-display text-[clamp(2.25rem,4.8vw,3.875rem)] leading-[1.02] font-medium tracking-[-0.03em]"
            >
              {plant.name_common}
            </h1>
            <p className="mt-2.5 text-lg italic opacity-85">{plant.name_scientific}</p>
            <p className="mt-4 max-w-[34em] text-[1.0625rem] leading-[1.55] opacity-95">{plant.description}</p>

            <nav aria-label="Jump to section" className="mt-5.5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
              <span className="col-span-full mb-0.5 w-full text-overline uppercase opacity-80">Jump to</span>
              {jumpLinks.map(({ href, label, count }) => (
                <a
                  key={href}
                  href={href}
                  className="group inline-flex min-h-10.5 items-center gap-2 rounded-full bg-yellow py-0 pr-3 pl-4 text-caption font-bold tracking-widest text-ink uppercase shadow-[0_3px_0_rgba(0,0,0,0.25)] transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-paper hover:shadow-[0_5px_0_rgba(0,0,0,0.25)] focus-visible:bg-paper active:translate-y-px active:shadow-[0_1px_0_rgba(0,0,0,0.25)]"
                >
                  {label}
                  <span className="inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full bg-ink/14 px-1.5 text-[0.6875rem] tracking-normal">
                    {count}
                  </span>
                  <ArrowUpRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 max-sm:ml-auto"
                    strokeWidth={2.6}
                    aria-hidden
                  />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </WaveBand>

      <section aria-label="At a glance" className="mx-auto max-w-300 px-4 pt-18 pb-8 md:px-8">
        <div className="grid grid-cols-3 gap-3">
          <Fact value={compounds.length} label="compounds" color="bg-lavender" />
          <Fact value={uses.length} label="uses cited" color="bg-pink" />
          <Fact value={cautions.length} label="cautions" color="bg-yellow" />
        </div>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
          <div className="flex items-baseline gap-2">
            <dt className="text-overline text-ink-secondary uppercase">
              {plant.category.length > 1 ? "Categories" : "Category"}
            </dt>
            <dd className="font-semibold">{plant.category.map((c) => categoryMeta[c].label).join(", ")}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-overline text-ink-secondary uppercase">Data sources</dt>
            <dd className="font-semibold">{getDataSources(refs)}</dd>
          </div>
        </dl>
      </section>

      {names.length > 0 && (
        <section aria-label="Local names" className="mx-auto max-w-300 px-4 py-6 md:px-8">
          <SayItIn names={names} />
          {site.correctionsFormUrl && (
            <p className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.9375rem] text-ink-secondary">
              <PencilLine className="size-4 shrink-0 text-purple" aria-hidden />
              <span>Spot a wrong name, or know another one?</span>
              <a
                href={site.correctionsFormUrl}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-purple underline underline-offset-3 hover:text-green"
              >
                Tell us here ↗
              </a>
            </p>
          )}
        </section>
      )}

      <CitationProvider>
        <section id="uses" aria-labelledby="uses-title" className="mx-auto max-w-300 scroll-mt-21 px-4 py-18 md:px-8">
          <h2 id="uses-title" className={`${sectionHeading} mb-5.5 text-green`}>
            Traditional &amp; Common Uses
          </h2>
          <div
            role="note"
            className="mb-4.5 flex items-start gap-3.5 rounded-[18px] border border-[#f3b9b9] bg-[#fde8e8] px-5 py-4.5 text-[#7f1d1d]"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fbd0d0] text-rust">
              <ShieldAlert className="size-5.5" aria-hidden />
            </span>
            <div>
              <h3 className="font-display text-lg font-medium">Important medical disclaimer</h3>
              <p className="mt-1 text-[#8e2a2a]">
                The information below is for educational reference only. It does not constitute
                medical advice. Always consult a qualified healthcare provider.
              </p>
            </div>
          </div>
          <UsesList uses={uses} sources={refs} />
        </section>

        <section id="compounds" aria-labelledby="compounds-title" className="mx-auto max-w-300 scroll-mt-21 px-4 pt-6 pb-18 md:px-8">
          <h2 id="compounds-title" className={`${sectionHeading} mb-5.5 text-green`}>
            Known Phytochemicals
          </h2>
          <CompoundGrid compounds={compounds} sources={refs} />
        </section>

        <section id="cautions" aria-labelledby="cautions-title" className="mx-auto max-w-300 scroll-mt-21 px-4 pt-6 pb-18 md:px-8">
          <div className="mb-5.5 flex flex-wrap items-end justify-between gap-3.5">
            <h2 id="cautions-title" className={`${sectionHeading} text-green`}>
              Cautions &amp; Contraindications
            </h2>
            {severities.length > 0 && (
              <ul className="flex flex-wrap gap-x-4.5 gap-y-2" aria-label="Severity levels">
                {severities.map((severity) => (
                  <li key={severity} className="inline-flex items-center gap-2">
                    <SeverityPill severity={severity} />
                    <small className="text-[0.8125rem] text-ink-secondary">
                      {severityStyles[severity].description}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <CautionList cautions={cautions} sources={refs} />
        </section>

        <WaveBand tone="purple" id="sources" aria-labelledby="sources-title" className="my-6 scroll-mt-21">
          <div className="mx-auto max-w-300 px-4 pt-14 pb-16 md:px-8">
            <h2 id="sources-title" className={`${sectionHeading} mb-5.5`}>
              Sources &amp; Citations
            </h2>
            <SourceList sources={refs} />
          </div>
        </WaveBand>
      </CitationProvider>

      <section aria-labelledby="suggested-title" className="mx-auto max-w-300 px-4 py-18 md:px-8">
        <SectionHeading id="suggested-title" title="You Might Also Like" href="/explore" />
        <ul className="grid gap-8 sm:grid-cols-2 sm:gap-5.5 lg:grid-cols-3">
          {suggested.map((other) => (
            <li key={other.id}>
              <PhotoCard plant={other} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Fact({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className={`rounded-[18px] px-2 py-4.5 text-center sm:px-4.5 ${color}`}>
      <b className="block font-display text-[2.5rem] leading-none font-semibold">{value}</b>
      <small className="block text-[0.625rem] font-bold tracking-[0.06em] uppercase sm:text-caption sm:tracking-widest">{label}</small>
    </div>
  );
}
