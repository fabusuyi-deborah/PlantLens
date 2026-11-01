"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { roundButtonStyles } from "@/components/ui/button";

export interface CategoryCardData {
  href: string;
  label: string;
  count: string;
  photo?: string;
}

/** Side-scrolling row of category photo cards, with arrow buttons for mouse users. */
export function CategoryRow({ categories }: { categories: CategoryCardData[] }) {
  const rowRef = useRef<HTMLUListElement>(null);

  function scrollByCards(direction: 1 | -1) {
    const row = rowRef.current;
    if (!row) return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior });
  }

  return (
    <>
      <ul
        ref={rowRef}
        // The inline padding lines the first card up with the page content; matching scroll-padding
        // keeps snapping from pulling it back to the screen edge.
        className="flex snap-x snap-mandatory scroll-px-[max(1rem,calc((100%_-_75rem)/2_+_2rem))] gap-4.5 overflow-x-auto px-[max(1rem,calc((100%_-_75rem)/2_+_2rem))] pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => (
          <li key={category.href} className="w-[clamp(10.625rem,19vw,14.375rem)] shrink-0 snap-start">
            <Link href={category.href} className="group flex flex-col gap-2.5 text-center">
              <span className="relative aspect-square overflow-hidden rounded-[22px] bg-line">
                {category.photo && (
                  <Image
                    src={category.photo}
                    alt=""
                    fill
                    sizes="230px"
                    className="object-cover transition-transform duration-500 group-hover:scale-107 group-hover:rotate-2"
                  />
                )}
              </span>
              <span className="font-display text-[1.0625rem] font-medium transition-colors group-hover:text-purple">
                {category.label}
              </span>
              <span className="text-[0.8125rem] text-ink-secondary">{category.count}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-2.5 flex justify-center gap-2 text-green">
        <button type="button" onClick={() => scrollByCards(-1)} aria-label="Scroll categories left" className={`${roundButtonStyles} hover:bg-green hover:text-paper`}>
          <ArrowLeft className="size-4.5" aria-hidden />
        </button>
        <button type="button" onClick={() => scrollByCards(1)} aria-label="Scroll categories right" className={`${roundButtonStyles} hover:bg-green hover:text-paper`}>
          <ArrowRight className="size-4.5" aria-hidden />
        </button>
      </div>
    </>
  );
}
