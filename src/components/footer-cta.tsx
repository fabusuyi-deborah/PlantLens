"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonStyles } from "@/components/ui/button";
import { site } from "@/lib/site";

/** Buttons in the footer's green band. The About page adds a way into the plants. */
export function FooterCta() {
  const onAbout = usePathname() === "/about";
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {onAbout && (
        <Link href="/explore" className={buttonStyles()}>
          Explore plants
        </Link>
      )}
      <a
        href={site.repoUrl}
        target="_blank"
        rel="noreferrer"
        className={buttonStyles({ variant: onAbout ? "onDark" : "primary" })}
      >
        Follow on GitHub
      </a>
    </div>
  );
}
