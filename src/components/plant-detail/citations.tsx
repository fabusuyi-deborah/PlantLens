"use client";

import { createContext, useContext, useState } from "react";

/**
 * Which citation is open on the plant page. Opening one shows its source under the claim and
 * highlights the matching entry in the Sources list.
 */
const OpenCitation = createContext<{
  openKey: string | null;
  openRef: number | null;
  toggle: (key: string, ref: number) => void;
}>({ openKey: null, openRef: null, toggle: () => {} });

export function CitationProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<{ key: string; ref: number } | null>(null);
  return (
    <OpenCitation.Provider
      value={{
        openKey: open?.key ?? null,
        openRef: open?.ref ?? null,
        toggle: (key, ref) => setOpen((current) => (current?.key === key ? null : { key, ref })),
      }}
    >
      {children}
    </OpenCitation.Provider>
  );
}

export function useOpenCitation() {
  return useContext(OpenCitation);
}

/**
 * A claim followed by its citation number. Hovering (or keyboard focus) shows the source in a
 * tooltip; pressing the number pins it below the claim.
 */
export function CitedText({
  id,
  refNumber,
  source,
  className = "",
  children,
}: {
  id: string;
  refNumber: number;
  source: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { openKey, toggle } = useOpenCitation();
  const open = openKey === id;
  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <p className={className}>
        {children}
        <span className="group/cite relative inline-block">
          <button
            type="button"
            onClick={() => toggle(id, refNumber)}
            aria-expanded={open}
            aria-controls={`${id}-source`}
            aria-label={`Source ${refNumber}: ${source}`}
            className="peer ml-1.5 inline-flex min-h-6.5 min-w-7 items-center justify-center rounded-full bg-lavender px-2 align-[2px] text-xs font-bold text-ink transition-colors hover:bg-purple hover:text-paper aria-expanded:bg-purple aria-expanded:text-paper"
          >
            {refNumber}
          </button>
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 hidden w-max max-w-[min(280px,70vw)] -translate-x-1/2 rounded-[10px] bg-ink px-3 py-2 text-left text-[0.8125rem] leading-snug font-medium text-paper after:absolute after:top-full after:left-1/2 after:-ml-1.5 after:border-6 after:border-transparent after:border-t-ink peer-focus-visible:block [@media(hover:hover)]:group-hover/cite:block"
          >
            {source}
          </span>
        </span>
      </p>
      <p id={`${id}-source`} hidden={!open} className="animate-fade-up rounded-xl bg-[#f1eafd] px-3.5 py-2.5 text-body-sm font-semibold">
        [{refNumber}] {source}
      </p>
    </div>
  );
}
