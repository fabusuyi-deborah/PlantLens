import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/logo";
import { GithubIcon, TwitterIcon } from "@/components/ui/brand-icons";
import { repoUrl } from "@/lib/site";

// TODO: replace "#" with the real writing series, social and email links.
const columns = [
  {
    title: "Product",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "Categories", href: "/categories" },
      { label: "Search", href: "/explore" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Data Sources", href: "/sources" },
      { label: "NMPPDB", href: "https://nmppdb.com.ng" },
      { label: "Dr. Duke's DB", href: "https://phytochem.nal.usda.gov" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "About", href: "/about" },
      { label: "GitHub", href: repoUrl },
      { label: "Writing Series", href: "#" },
    ],
  },
];

const socials = [
  { label: "GitHub", href: repoUrl, icon: GithubIcon },
  { label: "Twitter", href: "#", icon: TwitterIcon },
  { label: "Email", href: "#", icon: Mail },
];

export function Footer() {
  return (
    <footer className="bg-ink text-ink-muted">
      <div className="mx-auto max-w-336 px-4 pt-12 pb-8 md:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <Logo inverted />
            <p className="mt-3 text-body">Nigeria&apos;s plant knowledge, backed by science.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-body font-semibold text-white">{column.title}</h3>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm">
            © 2026 PlantLens. Data sourced under CC0 and with NMPPDB attribution.
          </p>
          <ul className="flex gap-4">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a href={href} aria-label={label} className="transition-colors hover:text-white">
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className = "text-body transition-colors hover:text-white";
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
