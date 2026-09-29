import { BookOpen, FileText } from "lucide-react";

export function Card({
  title,
  icon: Icon,
  iconClassName = "text-accent",
  aside,
  children,
  className = "",
}: {
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-border bg-bg-elevated p-6 md:p-7 ${className}`}>
      {title && (
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-3 text-card-heading text-ink">
            {Icon && <Icon className={`size-5 shrink-0 ${iconClassName}`} aria-hidden />}
            {title}
          </h2>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export function Citation({ children }: { children: string }) {
  return (
    <p className="mt-1.5 flex gap-1.5 text-caption font-normal tracking-normal text-ink-muted">
      <BookOpen className="mt-px size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border bg-bg-secondary px-5 py-8 text-center text-body text-ink-tertiary">
      {children}
    </p>
  );
}

export function SourcesCard({ citations }: { citations: string[] }) {
  return (
    <Card title="Sources & Citations" icon={BookOpen} iconClassName="text-ink-tertiary">
      <ol className="space-y-3">
        {citations.map((citation) => (
          <li key={citation} className="flex gap-3 rounded-md bg-bg-secondary px-4 py-3.5">
            <FileText className="mt-0.5 size-4 shrink-0 text-ink-muted" aria-hidden />
            <span className="text-body text-ink">{citation}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

const classPalette = [
  "bg-accent-light text-accent-dark",
  "bg-accent-secondary-light text-accent-secondary",
  "bg-warm-light text-amber-700",
  "bg-danger-light text-danger",
  "bg-cyan-50 text-cyan-700",
];

/** Consistent colour for a compound class, based on its position in the plant's class list. */
export function classPillStyle(compoundClass: string, allClasses: string[]): string {
  return classPalette[Math.max(0, allClasses.indexOf(compoundClass)) % classPalette.length];
}
