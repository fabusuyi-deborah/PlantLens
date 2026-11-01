"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };

/** Desktop navigation links, with the current section underlined. */
export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <ul className="hidden items-center gap-7 text-caption uppercase md:flex">
      {links.map((link) => {
        const active =
          pathname === link.href ||
          pathname.startsWith(`${link.href}/`) ||
          (link.href === "/explore" && pathname.startsWith("/plants/"));
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className="text-ink transition-colors hover:text-purple aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-6"
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
