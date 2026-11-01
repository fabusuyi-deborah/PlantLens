import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import { FooterCta } from "@/components/footer-cta";
import { Logo } from "@/components/logo";
import { WaveBand } from "@/components/ui/wave-band";
import { getAllPlants } from "@/lib/plants";
import { site } from "@/lib/site";

type FooterLinkItem = { label: string; href: string };

const columns: { title: string; links: FooterLinkItem[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "All plants", href: "/explore" },
      { label: "Categories", href: "/categories" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Popular",
    links: [
      { label: "Bitter leaf", href: "/plants/bitter-leaf" },
      { label: "Moringa", href: "/plants/moringa" },
      { label: "Scent leaf", href: "/plants/scent-leaf" },
    ],
  },
  {
    title: "Sources",
    links: [
      { label: "Data sources", href: "/sources" },
      { label: "Photo credits", href: "/sources#photo-credits" },
      { label: "NMPPDB", href: "https://nmppdb.com.ng" },
      { label: "Dr. Duke's DB", href: "https://phytochem.nal.usda.gov" },
      ...(site.correctionsFormUrl
        ? [{ label: "Report a correction", href: site.correctionsFormUrl }]
        : []),
    ],
  },
];

export function Footer() {
  const plantCount = getAllPlants().length;

  return (
    <footer className="mt-8">
      <WaveBand tone="green" bottom={false}>
        <div className="mx-auto flex max-w-300 flex-col items-center gap-3.5 px-4 pt-14 pb-16 text-center md:px-8">
          <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.625rem)] leading-tight font-medium">
            More plants are on the way.
          </h2>
          <p className="max-w-[30em] text-body opacity-90">
            PlantLens is growing beyond its first {plantCount} plants. Follow the build and the data
            as it lands.
          </p>
          <FooterCta />
        </div>
      </WaveBand>
      <Disclaimer />

      <div className="mx-auto max-w-300 px-4 pt-11 pb-7 md:px-8">
        <div className="grid grid-cols-3 gap-x-3.5 gap-y-6 md:grid-cols-[1.6fr_repeat(3,1fr)] md:gap-7">
          <div className="col-span-3 flex flex-col gap-2.5 border-b border-line pb-5 md:col-span-1 md:border-0 md:pb-0">
            <Logo size="lg" className="self-start" />
            <p className="max-w-[22em] text-body text-ink-secondary">
              Africa&apos;s plant knowledge, backed by science.
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-2.5">
              <h3 className="text-overline text-ink-secondary uppercase">{column.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-9 border-t border-line pt-4 text-caption font-normal tracking-normal text-ink-secondary">
          © 2026 PlantLens. Data sourced under CC0 and with NMPPDB attribution.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className = "text-body-sm text-ink transition-colors hover:text-purple";
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
