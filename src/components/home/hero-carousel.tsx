"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CategoryPill } from "@/components/ui/category-pill";
import { roundButtonOnDarkHover, roundButtonStyles } from "@/components/ui/button";
import { useInterval, usePrefersReducedMotion } from "@/lib/use-motion";
import type { PlantCategory } from "@/types/plant";

export interface HeroSlide {
  id: string;
  name: string;
  scientific: string;
  categories: PlantCategory[];
  photo?: string;
  blurb: string;
  localNames: { code: string; language: string; name: string }[];
}

/**
 * Featured plants on the green band. Advances every 7s; hovering or focusing inside holds it,
 * and it stays still for people who prefer reduced motion.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  useInterval(next, 7000, !held && !reduceMotion);

  const slide = slides[index];

  return (
    <div
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      aria-roledescription="carousel"
      aria-label="Featured plants"
      className="mx-auto grid max-w-300 items-center gap-8 px-4 pt-7 pb-9 md:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12"
    >
      <Link
        key={`photo-${slide.id}`}
        href={`/plants/${slide.id}`}
        className="relative block aspect-[4/3.1] animate-fade-up overflow-hidden rounded-[18px] bg-green-dark"
      >
        {slide.photo && (
          <Image
            src={slide.photo}
            alt={`${slide.name}, ${slide.scientific}`}
            fill
            sizes="(min-width: 1024px) 620px, 100vw"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            className="object-cover"
          />
        )}
      </Link>

      <div key={`text-${slide.id}`} className="animate-fade-up" aria-live={held ? "polite" : "off"}>
        <div className="flex flex-wrap gap-1.5">
          {slide.categories.map((category) => (
            <CategoryPill key={category} category={category} />
          ))}
        </div>
        <h2 className="mt-3.5 flex min-h-[2.04em] items-end font-display text-[clamp(2.25rem,4.8vw,3.875rem)] leading-[1.02] font-medium tracking-[-0.03em] sm:min-h-0">
          {slide.name}
        </h2>
        <p className="mt-2.5 text-lg italic opacity-85">{slide.scientific}</p>
        {slide.localNames.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Local names">
            {slide.localNames.map(({ code, language, name }) => (
              <li
                key={language}
                title={language}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-paper/12 px-3 text-body-sm font-semibold"
              >
                <span className="text-[0.65625rem] tracking-widest opacity-90">{code}</span>
                {name}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 line-clamp-3 min-h-[4.65em] max-w-[30em] text-[1.0625rem] leading-[1.55] opacity-95 sm:line-clamp-none sm:min-h-0">
          {slide.blurb}
        </p>
        <Link
          href={`/plants/${slide.id}`}
          className="mt-5.5 inline-flex items-center gap-2 border-b-2 border-yellow pb-0.5 text-caption font-bold tracking-[0.14em] uppercase transition-colors hover:text-yellow"
        >
          See the plant <ArrowRight className="size-3.5" aria-hidden />
        </Link>

        <div className="mt-6.5 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            aria-label="Previous featured plant"
            className={`${roundButtonStyles} ${roundButtonOnDarkHover}`}
          >
            <ArrowLeft className="size-4.5" aria-hidden />
          </button>
          <div className="flex" role="group" aria-label="Choose a featured plant">
            {slides.map((s, n) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(n)}
                aria-label={s.name}
                aria-current={n === index ? "true" : undefined}
                // A 24px tap target around the small visible dot.
                className="group/dot flex size-6 items-center justify-center"
              >
                <span className="size-2.5 rounded-full border-[1.5px] border-paper transition-colors group-aria-[current=true]/dot:border-yellow group-aria-[current=true]/dot:bg-yellow" />
              </button>
            ))}
          </div>
          <button type="button" onClick={next} aria-label="Next featured plant" className={`${roundButtonStyles} ${roundButtonOnDarkHover}`}>
            <ArrowRight className="size-4.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
