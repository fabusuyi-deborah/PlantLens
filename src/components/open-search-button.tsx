"use client";

/** Event the navbar search listens for, so any page can open the search dialog. */
export const OPEN_SEARCH_EVENT = "plantlens:open-search";

export function OpenSearchButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))} className={className}>
      {children}
    </button>
  );
}
