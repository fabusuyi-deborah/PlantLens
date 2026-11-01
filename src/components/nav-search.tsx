"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Search } from "lucide-react";
import { CommandPalette } from "@/components/command-palette";
import type { SearchablePlant } from "@/lib/search";

const subscribeNoop = () => () => {};

/** Navbar search pill. Click it or press ⌘K / Ctrl+K to open the command palette. */
export function NavSearch({ plants }: { plants: SearchablePlant[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Server render assumes Mac, matching the design; Windows/Linux switch to "Ctrl K" on hydrate.
  const isMac = useSyncExternalStore(
    subscribeNoop,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true,
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-green bg-paper pr-1.5 pl-4 text-caption text-green uppercase transition-colors hover:bg-green hover:text-paper"
      >
        <Search className="size-4" strokeWidth={2.4} aria-hidden />
        <span>Search</span>
        <span className="sr-only"> plants</span>
        <kbd className="hidden min-h-7 items-center rounded-full border border-line bg-cream px-2 font-sans text-[0.6875rem] tracking-normal text-green sm:inline-flex group-hover:bg-paper">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>
      {open && <CommandPalette plants={plants} onClose={close} />}
    </>
  );
}
