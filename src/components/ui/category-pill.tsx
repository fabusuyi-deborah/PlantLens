import { categoryMeta } from "@/lib/categories";
import type { PlantCategory } from "@/types/plant";

/** Pink category tag, e.g. "MEDICINAL". */
export function CategoryPill({
  category,
  withIcon = false,
}: {
  category: PlantCategory;
  withIcon?: boolean;
}) {
  const { label, icon: Icon } = categoryMeta[category];
  return (
    <span className="inline-flex min-h-6 items-center gap-1.5 rounded-full bg-pink px-2.5 text-[0.65625rem] font-bold tracking-[0.08em] text-ink uppercase">
      {withIcon && <Icon className="size-3" aria-hidden />}
      {label}
    </span>
  );
}
