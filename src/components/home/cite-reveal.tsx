"use client";

import { useId, useState } from "react";

/** A quoted claim with a citation number that reveals its source when pressed. */
export function CiteReveal({ claim, number, source }: { claim: string; number: number; source: string }) {
  const [open, setOpen] = useState(false);
  const noteId = useId();
  return (
    <div className="mt-1.5 flex flex-col gap-2.5">
      <p className="font-semibold">
        “{claim}”
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={noteId}
          aria-label={open ? "Hide source" : "Show source"}
          className="ml-1.5 inline-flex min-h-6.5 min-w-7 items-center justify-center rounded-full bg-lavender px-2 align-[2px] text-xs font-bold transition-colors hover:bg-purple hover:text-paper aria-expanded:bg-purple aria-expanded:text-paper"
        >
          {number}
        </button>
      </p>
      <p id={noteId} hidden={!open} className="rounded-xl bg-[#f1eafd] px-3.5 py-2.5 text-body-sm font-semibold">
        {source}
      </p>
    </div>
  );
}
