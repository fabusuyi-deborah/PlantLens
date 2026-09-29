import Link from "next/link";
import { Leaf } from "lucide-react";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Leaf
        className={`size-5 ${inverted ? "text-accent-light" : "text-accent"}`}
        aria-hidden
      />
      <span
        className={`text-[17px] font-semibold tracking-tight ${inverted ? "text-white" : "text-ink"}`}
      >
        PlantLens
      </span>
    </Link>
  );
}
