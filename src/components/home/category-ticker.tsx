"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { PauseButton } from "@/components/ui/pause-button";
import { usePrefersReducedMotion } from "@/lib/use-motion";

/**
 * Scrolling strip of category links on a green band. The list repeats so the loop is seamless;
 * only the first copy is reachable by keyboard and screen readers.
 */
export function CategoryTicker({ items }: { items: { href: string; label: string }[] }) {
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section aria-label="Plant categories" className="relative my-6 overflow-hidden bg-green">
      <div
        className={`flex w-max animate-ticker py-5.5 hover:[animation-play-state:paused] ${
          paused ? "[animation-play-state:paused]" : ""
        }`}
      >
        {[0, 1, 2, 3].map((copy) =>
          items.map((item) => (
            <span
              key={`${copy}-${item.href}`}
              aria-hidden={copy > 0 || undefined}
              className="inline-flex items-center gap-7 pr-7 font-display text-[clamp(1.625rem,3.4vw,2.75rem)] font-medium tracking-[-0.02em] whitespace-nowrap text-paper"
            >
              <Link href={item.href} tabIndex={copy > 0 ? -1 : undefined} className="transition-colors hover:text-yellow">
                {item.label}
              </Link>
              <Leaf className="size-[0.85em] shrink-0 origin-[20%_90%] animate-leaf-sway text-yellow" aria-hidden />
            </span>
          )),
        )}
      </div>
      {!reduceMotion && (
        <span className="absolute inset-y-0 right-0 z-10 flex items-center bg-linear-to-r from-green/0 to-green to-55% pr-3.5 pl-14">
          <PauseButton
            paused={paused}
            onToggle={() => setPaused((p) => !p)}
            what="category ticker"
            className="bg-green"
          />
        </span>
      )}
    </section>
  );
}
