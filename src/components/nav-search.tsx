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
        className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-body-sm text-ink-muted transition-colors hover:border-ink-muted"
      >
        <Search className="size-3.5" aria-hidden />
        <span className="hidden sm:inline">Search plants...</span>
        <span className="sr-only sm:hidden">Search plants</span>
        <kbd className="hidden rounded-sm bg-surface px-1.5 py-0.5 font-sans text-overline text-ink-tertiary sm:inline">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>
      {open && <CommandPalette plants={plants} onClose={close} />}
    </>
  );
}
