"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { PauseButton } from "@/components/ui/pause-button";
import { useInterval, useMediaQuery, usePrefersReducedMotion } from "@/lib/use-motion";

/** Cross-fading plant photos beside the purple search band. Not shown on phones. */
export function PhotoCarousel({ photos }: { photos: { src: string; alt: string }[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 640px)");
  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length]);
  useInterval(next, 3500, wide && !paused && !reduceMotion);

  return (
    <div
      aria-roledescription="carousel"
      aria-label="Popular plants"
      className="relative aspect-4/5 w-full max-w-130 justify-self-center overflow-hidden rounded-hero border-8 border-paper bg-paper shadow-[0_30px_50px_-30px_rgba(0,0,0,0.55)] max-sm:hidden lg:justify-self-end"
    >
      {photos.map((photo, n) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="520px"
          aria-hidden={n !== index}
          className={`object-cover transition-[opacity,scale] ease-out ${
            n === index ? "scale-100 opacity-100 duration-[900ms,5s]" : "scale-104 opacity-0 duration-[900ms]"
          }`}
        />
      ))}
      {!reduceMotion && (
        <PauseButton
          paused={paused}
          onToggle={() => setPaused((p) => !p)}
          what="photos"
          className="absolute bottom-2.5 left-3 z-10 bg-ink/55"
        />
      )}
      <div className="absolute inset-x-0 bottom-3.5 z-[5] flex justify-center gap-1.5" role="group" aria-label="Choose photo">
        {photos.map((photo, n) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setIndex(n)}
            aria-label={photo.alt}
            aria-current={n === index ? "true" : undefined}
            className="h-2.5 w-2.5 rounded-full border-2 border-paper shadow-[0_0_0_1px_rgba(11,61,39,0.35)] transition-[width,background-color] duration-300 aria-[current=true]:w-6.5 aria-[current=true]:bg-paper"
          />
        ))}
      </div>
    </div>
  );
}
