import Link from "next/link";
import { Leaf } from "lucide-react";

export function Logo({ className = "", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  return (
    <Link
      href="/"
      aria-label="PlantLens home"
      className={`inline-flex items-center gap-2 font-bold tracking-[-0.03em] text-green ${
        size === "lg" ? "text-[1.625rem]" : "text-[1.3125rem]"
      } ${className}`}
    >
      <Leaf className={size === "lg" ? "size-7" : "size-6"} strokeWidth={2} aria-hidden />
      PlantLens
    </Link>
  );
}
