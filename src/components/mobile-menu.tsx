"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

type NavLink = { href: string; label: string };

/** Hamburger menu shown below the md breakpoint, where the navbar links are hidden. */
export function MobileMenu({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  // Remember which page the menu was opened on, so navigating anywhere closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenedOn(null);
        buttonRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpenedOn(null);
    }
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpenedOn(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className={`flex size-11 items-center justify-center rounded-full border-[1.5px] border-green transition-colors ${
          open ? "bg-green text-paper" : "bg-paper text-green"
        }`}
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </button>
      {open && (
        <ul
          id="mobile-menu"
          className="absolute inset-x-4 top-full mt-1 max-h-[calc(100vh-6rem)] animate-fade-up overflow-auto rounded-panel bg-green p-2 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]"
        >
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpenedOn(null)}
                  aria-current={active ? "page" : undefined}
                  className="flex min-h-13 items-center rounded-[14px] px-4 font-display text-xl font-medium text-paper transition-colors hover:bg-paper/12 aria-[current=page]:bg-paper/12"
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
