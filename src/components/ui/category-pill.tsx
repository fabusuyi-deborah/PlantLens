import { categoryMeta } from "@/lib/categories";
import type { PlantCategory } from "@/types/plant";

export function CategoryPill({
  category,
  withIcon = false,
}: {
  category: PlantCategory;
  withIcon?: boolean;
}) {
  const { label, icon: Icon, pill, bg, text } = categoryMeta[category];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-body-sm font-medium ${pill ?? `${bg} ${text}`} ${withIcon ? "py-1" : ""}`}
    >
      {withIcon && <Icon className="size-3.5" aria-hidden />}
      {label}
    </span>
  );
}
