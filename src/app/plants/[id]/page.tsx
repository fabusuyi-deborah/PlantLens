import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryPill } from "@/components/ui/category-pill";
import { getAllPlants, getPlantById } from "@/lib/plants";

export function generateStaticParams() {
  return getAllPlants().map((plant) => ({ id: plant.id }));
}

export async function generateMetadata(
  props: PageProps<"/plants/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const plant = getPlantById(id);
  return plant
    ? { title: `${plant.name_common} · PlantLens`, description: plant.description }
    : {};
}

export default async function PlantPage(props: PageProps<"/plants/[id]">) {
  const { id } = await props.params;
  const plant = getPlantById(id);
  if (!plant) notFound();

  const { other = [], ...mainNames } = plant.names_local;
  const localNames = [
    ...Object.entries(mainNames),
    ...other.map(({ label, name }) => [label, name] as const),
  ];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <Link href="/" className="text-body text-accent hover:underline">
        ← All plants
      </Link>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        {plant.name_common}
      </h1>
      <p className="italic text-ink-tertiary">{plant.name_scientific}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {plant.category.map((category) => (
          <CategoryPill key={category} category={category} />
        ))}
      </div>

      {localNames.length > 0 && (
        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          {localNames.map(([language, name]) => (
            <div key={language} className="contents">
              <dt className="capitalize text-ink-tertiary">{language}</dt>
              <dd>{name}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-6 leading-relaxed">{plant.description}</p>

      <Section title="Traditional uses">
        {plant.traditional_uses.map((item, i) => (
          <Cited key={i} text={item.use} citation={item.source_citation} />
        ))}
      </Section>

      <Section title="Phytochemicals">
        {plant.phytochemicals?.map((item) => (
          <Cited
            key={item.compound}
            text={
              <>
                <strong className="font-medium">{item.compound}</strong>:{" "}
                {item.associated_properties}
              </>
            }
            citation={item.source_citation}
          />
        ))}
      </Section>

      <Section title="Cautions">
        {plant.cautions.map((item, i) => (
          <Cited key={i} text={item.note} citation={item.source_citation} />
        ))}
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode[] | undefined;
}) {
  if (!children || children.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <ul className="space-y-4">{children}</ul>
    </section>
  );
}

function Cited({ text, citation }: { text: React.ReactNode; citation: string }) {
  return (
    <li>
      <p>{text}</p>
      <p className="mt-1 text-xs text-ink-muted">Source: {citation}</p>
    </li>
  );
}
