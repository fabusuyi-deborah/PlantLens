import { TriangleAlert } from "lucide-react";

export function Disclaimer() {
  return (
    <aside className="bg-warm-light">
      <p className="mx-auto flex max-w-[1344px] items-center gap-2.5 px-4 py-3.5 text-body-sm text-amber-800 md:px-8">
        <TriangleAlert className="size-4 shrink-0 text-warm" aria-hidden />
        Phytochemical data is informational only — not medical advice. Always consult a
        healthcare professional.
      </p>
    </aside>
  );
}
