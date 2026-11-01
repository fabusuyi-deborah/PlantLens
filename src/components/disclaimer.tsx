"use client";

import { usePathname } from "next/navigation";
import { TriangleAlert } from "lucide-react";

/**
 * Site-wide medical disclaimer bar. Plant pages carry their own disclaimer beside the uses, and
 * the categories page makes no claims, so the bar is left off there to avoid repeating it.
 */
export function Disclaimer() {
  const pathname = usePathname();
  if (pathname.startsWith("/plants/") || pathname === "/categories") return null;
  return (
    <aside aria-label="Medical disclaimer" className="bg-warm-light text-[#6b4a00]">
      <p className="mx-auto flex max-w-300 items-center gap-2.5 px-4 py-3.5 text-body-sm font-medium md:px-8">
        <TriangleAlert className="size-4.5 shrink-0 text-warm" aria-hidden />
        Phytochemical data is informational only, not medical advice. Always consult a healthcare
        professional.
      </p>
    </aside>
  );
}
