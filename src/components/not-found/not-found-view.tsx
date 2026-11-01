import Link from "next/link";
import { OpenSearchButton } from "@/components/open-search-button";
import { BrokenLeaf } from "@/components/ui/broken-leaf";
import { buttonStyles } from "@/components/ui/button";
import { getPlantsByIds } from "@/lib/plants";

const popularIds = ["bitter-leaf", "moringa", "scent-leaf", "neem"];

/** 404 content: "4 [broken leaf] 4", a message, ways back in and popular plants. */
export function NotFoundView({ title, body }: { title: string; body: string }) {
  return (
    <main className="mx-auto flex max-w-300 flex-col items-center gap-4.5 px-4 pt-10 pb-14 text-center sm:pt-14 sm:pb-18 md:px-8">
      <div className="mb-1.5 flex items-center justify-center gap-1">
        <span aria-hidden className="font-display text-[clamp(6.875rem,18vw,12.5rem)] leading-[0.9] font-semibold tracking-[-0.04em] text-green">
          4
        </span>
        <BrokenLeaf size={190} className="-mx-1.5 h-auto w-[clamp(120px,18vw,190px)]" />
        <span aria-hidden className="font-display text-[clamp(6.875rem,18vw,12.5rem)] leading-[0.9] font-semibold tracking-[-0.04em] text-green">
          4
        </span>
      </div>
      <h1 className="max-w-[16ch] font-display text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.03em] text-green">
        {title}
      </h1>
      <p className="max-w-[36em] text-lg text-ink-secondary">
        {body} Try searching by any name, English, botanical, Yoruba, Igbo or Hausa, or head back to the
        plants.
      </p>
      <div className="mt-1.5 flex w-full max-w-80 flex-col gap-2.5 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
        <Link href="/explore" className={buttonStyles()}>
          Browse all plants
        </Link>
        <OpenSearchButton className={buttonStyles({ variant: "secondary" })}>Search plants</OpenSearchButton>
        <Link href="/" className={buttonStyles({ variant: "secondary" })}>
          Go home
        </Link>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
        <span className="mr-1 text-[0.8125rem] text-ink-secondary">Popular</span>
        {getPlantsByIds(popularIds).map((plant) => (
          <Link
            key={plant.id}
            href={`/plants/${plant.id}`}
            className="inline-flex min-h-8.5 items-center rounded-full bg-pink px-3.5 text-body-sm font-semibold transition-colors hover:bg-yellow"
          >
            {plant.name_common}
          </Link>
        ))}
      </div>
    </main>
  );
}
