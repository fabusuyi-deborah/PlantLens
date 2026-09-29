import Link from "next/link";
import { Logo } from "@/components/logo";
import { NavSearch } from "@/components/nav-search";
import { getAllPlants } from "@/lib/plants";
import { toSearchable } from "@/lib/search";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/sources", label: "Sources" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
      <nav className="relative flex h-14 items-center justify-between px-4 md:px-10">
        <Logo />
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-body-lg text-ink-secondary transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <NavSearch plants={getAllPlants().map(toSearchable)} />
      </nav>
    </header>
  );
}
