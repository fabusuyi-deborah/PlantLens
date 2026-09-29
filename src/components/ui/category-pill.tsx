import { categoryMeta } from "@/lib/categories";
import type { PlantCategory } from "@/types/plant";

export function CategoryPill({ category }: { category: PlantCategory }) {
  const meta = categoryMeta[category];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-body-sm font-medium ${meta.bg} ${meta.text}`}
    >
      {meta.label}
    </span>
  );
}
