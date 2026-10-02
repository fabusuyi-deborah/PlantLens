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
        className="flex size-8 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface hover:text-ink"
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </button>
      {open && (
        <ul
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-border bg-bg px-4 py-2 shadow-[0_8px_16px_rgba(10,37,64,0.06)]"
        >
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpenedOn(null)}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-sm px-3 py-3 text-body-lg transition-colors hover:bg-surface hover:text-ink ${
                    active ? "font-medium text-ink" : "text-ink-secondary"
                  }`}
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
