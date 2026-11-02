import Image from "next/image";
import Link from "next/link";
import { CategoryRow } from "@/components/home/category-row";
import { CategoryTicker } from "@/components/home/category-ticker";
import { CiteReveal } from "@/components/home/cite-reveal";
import { HeroCarousel, type HeroSlide } from "@/components/home/hero-carousel";
import { HomeSearch } from "@/components/home/home-search";
import { PhotoCarousel } from "@/components/home/photo-carousel";
import { PhotoCard, SideCard, TileCard, type TileColor } from "@/components/home/plant-cards";
import { SectionHeading } from "@/components/ui/section-heading";
import { WaveBand } from "@/components/ui/wave-band";
import { categoryMeta } from "@/lib/categories";
import { exploreHref } from "@/lib/explore-url";
import { getAllPlants, getCategoryCounts, getDatasetStats, getPlantById, getPlantsByIds } from "@/lib/plants";
import { mainLocalNames, plantBlurb, plural } from "@/lib/plant-text";
import { toSearchable } from "@/lib/search";
import type { Plant, PlantCategory } from "@/types/plant";

const heroIds = ["bitter-leaf", "roselle-zobo", "moringa", "turmeric"];
const featuredIds = ["bitter-leaf", "scent-leaf", "neem", "moringa", "bitter-kola"];
const popularIds = ["bitter-leaf", "moringa", "scent-leaf", "neem"];
const carouselIds = ["bitter-leaf", "roselle-zobo", "moringa", "turmeric", "scent-leaf", "ugwu", "kola-nut"];
const fruitTreeIds = ["pawpaw", "guava", "mango", "soursop"];

/** Category order on the home page, with the plant whose photo stands for each. */
const categoryCovers: [PlantCategory, string][] = [
  ["medicinal", "neem"],
  ["leafy_vegetable", "ugwu"],
  ["spice", "ginger"],
  ["beverage", "roselle-zobo"],
  ["culinary", "scent-leaf"],
  ["stimulant", "kola-nut"],
  ["vegetable", "garden-egg"],
];

const sideColors: TileColor[][] = [
  ["orange", "yellow", "pink"],
  ["lavender", "pink", "yellow"],
];

export default function Home() {
  const plants = getAllPlants();
  const searchable = plants.map(toSearchable);
  const stats = getDatasetStats();
  const counts = new Map(getCategoryCounts().map(({ category, count }) => [category, count]));
  const inCategory = (...categories: PlantCategory[]) =>
    plants.filter((plant) => plant.category.some((c) => categories.includes(c)));

  const heroSlides: HeroSlide[] = getPlantsByIds(heroIds).map((plant) => ({
    id: plant.id,
    name: plant.name_common,
    scientific: plant.name_scientific,
    categories: plant.category,
    photo: plant.photo_url,
    blurb: plantBlurb(plant),
    localNames: mainLocalNames(plant),
  }));
  const featured = getPlantsByIds(featuredIds);
  const richest = plants
    .map((plant, order) => ({ plant, order }))
    .sort(
      (a, b) =>
        (b.plant.phytochemicals?.length ?? 0) - (a.plant.phytochemicals?.length ?? 0) || a.order - b.order,
    )
    .slice(0, 3)
    .map(({ plant }) => plant);
  const spices = inCategory("spice", "beverage").slice(0, 4);
  const leafy = inCategory("leafy_vegetable", "vegetable").slice(0, 4);
  const fruitTrees = getPlantsByIds(fruitTreeIds);
  const categories = categoryCovers
    .filter(([category]) => counts.has(category))
    .map(([category, coverId]) => ({
      category,
      href: exploreHref({ category }),
      label: categoryMeta[category].pluralLabel,
      count: plural(counts.get(category) ?? 0, "plant"),
      photo: getPlantById(coverId)?.photo_url,
    }));
  const moringa = getPlantById("moringa");

  return (
    <main>
      {/* Intro: the page's one h1, a search and the dataset at a glance */}
      <section
        aria-labelledby="intro-title"
        className="mx-auto flex max-w-300 flex-col items-center gap-3.5 px-4 pt-9 pb-8 text-center sm:gap-4.5 sm:pt-14 sm:pb-11 md:px-8"
      >
        <h1
          id="intro-title"
          className="max-w-[15ch] font-display text-[clamp(2.375rem,6vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.035em] text-green"
        >
          Discover Africa&apos;s plants, by every name.
        </h1>
        <p className="max-w-[36em] text-body text-ink-secondary sm:text-lg">
          Search local names, traditional uses and real phytochemical data for African plants, starting with Nigeria. Every
          claim is cited.
        </p>
        <div className="w-full max-w-155">
          <HomeSearch
            plants={searchable}
            label="Search plants by any name"
            placeholder="Try ewuro, Moringa oleifera or zogale"
          />
        </div>
        <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:justify-center [&::-webkit-scrollbar]:hidden">
          <span className="mr-1 shrink-0 text-[0.8125rem] text-ink-secondary">Popular</span>
          {getPlantsByIds(popularIds).map((plant) => (
            <Link
              key={plant.id}
              href={`/plants/${plant.id}`}
              className="inline-flex min-h-8 shrink-0 items-center rounded-full bg-pink px-3.5 text-[0.8125rem] font-semibold transition-colors hover:bg-yellow sm:min-h-8.5 sm:text-body-sm"
            >
              {plant.name_common}
            </Link>
          ))}
        </div>
        <dl className="mt-1 grid w-full grid-cols-2 gap-2.5 sm:flex sm:w-auto sm:flex-wrap sm:justify-center sm:gap-x-5.5 sm:gap-y-2">
          <Stat value={stats.plants} label="curated plants" />
          <Stat value={stats.compounds} label="phytochemicals" />
          <Stat value={stats.languages} label="local languages" />
          <Stat value={stats.citations} label="research citations" />
        </dl>
      </section>

      <WaveBand tone="green" aria-label="Featured plant">
        <HeroCarousel slides={heroSlides} />
      </WaveBand>

      <Section>
        <SectionHeading
          title="Featured Plants"
          subtitle="Well-documented species with rich phytochemical profiles."
          href="/explore"
        />
        <div className="grid grid-cols-3 gap-x-2.5 gap-y-5 sm:grid-cols-2 sm:gap-x-5.5 sm:gap-y-6.5 lg:grid-cols-[2fr_1fr_1fr]">
          {featured.map((plant, i) =>
            i === 0 ? (
              <div key={plant.id} className="col-span-full flex lg:col-span-1 lg:row-span-2 [&>a]:flex-1">
                <PhotoCard plant={plant} size="fill" sizes="(min-width: 1024px) 600px, 100vw" />
              </div>
            ) : (
              <div key={plant.id} className={i === 4 ? "max-sm:hidden" : ""}>
                <PhotoCard plant={plant} compact sizes="(min-width: 1024px) 290px, (min-width: 640px) 50vw, 33vw" />
              </div>
            ),
          )}
        </div>
      </Section>

      <Section tight>
        <SectionHeading
          title="Richest in Compounds"
          subtitle="The plants with the most documented phytochemicals."
          href="/explore?sort=compounds"
        />
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-5 sm:grid-cols-3 sm:gap-3.5 lg:gap-5.5">
          {richest.map((plant, i) => (
            <div key={plant.id} className={i === 0 ? "max-sm:col-span-full" : ""}>
              <TileCard
                plant={plant}
                color={i === 1 ? "orange" : "lavender"}
                compact={i > 0}
                sizes="(min-width: 640px) 33vw, 100vw"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section tight id="home-about">
        <SectionHeading
          title="How We Source Our Data"
          subtitle="Everything behind the profiles, in one place."
          href="/sources"
          linkLabel="Read more"
        />
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div className="flex items-center justify-center rounded-card bg-pink p-6 sm:p-9">
            {moringa?.photo_url && (
              <div className="relative aspect-4/3 w-full -rotate-2 overflow-hidden rounded-xl shadow-[0_18px_36px_-18px_rgba(11,61,39,0.45)]">
                <Image src={moringa.photo_url} alt="Moringa leaves" fill sizes="(min-width: 1024px) 620px, 100vw" className="object-cover" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] font-medium text-green">
              Grandma&apos;s remedies, with receipts
            </h3>
            <p className="text-[1.0625rem] text-ink-secondary">
              Every use, compound and caution on PlantLens cites its source: NMPPDB (Nigeria&apos;s own
              medicinal plant database), Dr. Duke&apos;s USDA databases, or a peer-reviewed study. Local
              names are checked against NMPPDB for Nigerian languages and against regional references for the rest.
            </p>
            <CiteReveal
              claim="Bitter leaf is widely used in Nigeria for managing type 2 diabetes."
              number={3}
              source="Associated with lowered blood glucose in animal studies. Ijeh & Ejike (2011), via NMPPDB."
            />
          </div>
        </div>
      </Section>

      <WaveBand tone="purple" className="my-6" aria-labelledby="by-name-title">
        <div className="mx-auto grid max-w-300 items-center gap-10 px-4 pt-16 pb-18 md:px-8 lg:grid-cols-2">
          <div className="min-w-0">
            <h2
              id="by-name-title"
              className="font-display text-[clamp(1.875rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.02em]"
            >
              Find a plant by the name you grew up with.
            </h2>
            <p className="mt-4 mb-5.5 max-w-[30em] opacity-90">
              Ewuro, onugbu or mlonge? Type a name in Yoruba, Igbo, Hausa, Swahili or another local language, the
              English name or the botanical one. PlantLens finds the plant either way.
            </p>
            <HomeSearch
              plants={searchable}
              onDark
              label="Plant name in any language"
              placeholder="Try zogale, ewuro or oji"
              tryTerms={["ewuro", "zogale", "mlonge", "oji", "Curcuma"]}
            />
          </div>
          <PhotoCarousel
            photos={getPlantsByIds(carouselIds)
              .filter((plant) => plant.photo_url)
              .map((plant) => ({ src: plant.photo_url as string, alt: plant.name_common }))}
          />
        </div>
      </WaveBand>

      <section id="home-categories" aria-labelledby="categories-title" className="scroll-mt-21 py-18">
        <div className="mx-auto max-w-300 px-4 md:px-8">
          <SectionHeading
            id="categories-title"
            title="Popular Categories"
            subtitle="Find your next plant to read about."
            href="/categories"
          />
        </div>
        <CategoryRow categories={categories} />
      </section>

      <Section tight>
        <SectionHeading
          title="Spices & Drinks"
          subtitle="Pepper soup, zobo and everything in between."
          href={exploreHref({ category: "spice" })}
        />
        <FeatureStack plants={spices} featureColor="lavender" sideColors={sideColors[0]} />
      </Section>

      <Section tight>
        <SectionHeading
          title="Leafy Vegetables"
          subtitle="From the soup pot."
          href={exploreHref({ category: "leafy_vegetable" })}
        />
        <div className="grid grid-cols-3 gap-x-2.5 gap-y-5 sm:grid-cols-2 sm:gap-x-5.5 sm:gap-y-8 lg:grid-cols-4">
          {leafy.map((plant, i) => (
            <div key={plant.id} className={i === 0 ? "max-sm:col-span-full" : ""}>
              <PhotoCard
                plant={plant}
                shape="square"
                compact={i > 0}
                sizes="(min-width: 1024px) 290px, (min-width: 640px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
      </Section>

      <CategoryTicker items={categories.map(({ href, label }) => ({ href, label }))} />

      <Section>
        <SectionHeading
          title="Medicinal Fruit Trees"
          subtitle="Fruit in the market, medicine in the leaves."
          href={exploreHref({ category: "medicinal" })}
        />
        <FeatureStack plants={fruitTrees} featureColor="orange" sideColors={sideColors[1]} />
      </Section>

      <Section tight id="home-sources">
        <SectionHeading
          title="Where the Data Comes From"
          subtitle="Public research databases, credited on every claim."
          href="/sources"
          linkLabel="See all sources"
        />
        <ul className="grid gap-5.5 md:grid-cols-3">
          <SourceTile
            title="NMPPDB"
            body="Nigerian Medicinal Plants and Phytochemicals Database. Local names and Nigeria-specific findings."
            href="https://nmppdb.com.ng"
            color="bg-pink"
          />
          <SourceTile
            title="Dr. Duke's DB"
            body="USDA Phytochemical and Ethnobotanical Databases: compounds and recorded uses worldwide."
            href="https://phytochem.nal.usda.gov"
            color="bg-lavender"
          />
          <SourceTile
            title="Literature"
            body="Peer-reviewed studies fill gaps where a plant has no database entry. Photos from Wikimedia Commons and iNaturalist."
            color="bg-yellow"
          />
        </ul>
      </Section>
    </main>
  );
}

function Section({ children, tight = false, id }: { children: React.ReactNode; tight?: boolean; id?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-300 scroll-mt-21 px-4 pb-18 md:px-8 ${tight ? "pt-6" : "pt-18"}`}>
      {children}
    </section>
  );
}

/** A big tile card beside three side cards; stacks on narrower screens. */
function FeatureStack({
  plants,
  featureColor,
  sideColors,
}: {
  plants: Plant[];
  featureColor: TileColor;
  sideColors: TileColor[];
}) {
  const [feature, ...rest] = plants;
  if (!feature) return null;
  return (
    <div className="grid items-start gap-6.5 lg:grid-cols-[1fr_1.15fr]">
      <TileCard plant={feature} color={featureColor} feature sizes="(min-width: 1024px) 520px, 100vw" />
      <div className="flex flex-col gap-5.5">
        {rest.slice(0, 3).map((plant, i) => (
          <SideCard key={plant.id} plant={plant} color={sideColors[i % sideColors.length]} />
        ))}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col-reverse items-center gap-0.5 rounded-[14px] bg-paper px-1.5 py-3 text-[0.65625rem] font-bold tracking-widest text-ink-secondary uppercase sm:flex-row-reverse sm:gap-1 sm:bg-transparent sm:p-0 sm:text-[0.8125rem]">
      <dt>{label}</dt>
      <dd className="font-display text-[1.375rem] font-semibold text-green sm:text-[0.9375rem]">{value}</dd>
    </div>
  );
}

function SourceTile({ title, body, href, color }: { title: string; body: string; href?: string; color: string }) {
  return (
    <li className={`flex flex-col gap-2.5 rounded-panel p-7 ${color}`}>
      <h3 className="font-display text-2xl font-medium text-green">{title}</h3>
      <p>{body}</p>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-auto text-caption font-bold tracking-[0.12em] break-all uppercase underline underline-offset-4"
        >
          {href.replace("https://", "")} ↗
        </a>
      )}
    </li>
  );
}
