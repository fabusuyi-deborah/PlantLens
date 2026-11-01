import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { NavLinks } from "@/components/nav-links";
import { NavSearch } from "@/components/nav-search";
import { getAllPlants } from "@/lib/plants";
import { toSearchable } from "@/lib/search";

const links = [
  { href: "/explore", label: "Plants" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/sources", label: "Sources" },
];

export function Navbar() {
  return (
    // Sticky on phones so navigation is always in reach; scrolls away on larger screens.
    <header className="sticky top-0 z-40 bg-bg shadow-[0_8px_20px_-16px_rgba(11,61,39,0.45)] md:static md:shadow-none">
      <nav
        aria-label="Main"
        className="relative mx-auto flex min-h-16 max-w-300 items-center justify-between gap-4 px-4 md:px-8"
      >
        <Logo />
        <NavLinks links={links} />
        <div className="flex items-center gap-2">
          <NavSearch plants={getAllPlants().map(toSearchable)} />
          <MobileMenu links={[{ href: "/", label: "Home" }, ...links]} />
        </div>
      </nav>
    </header>
  );
}
