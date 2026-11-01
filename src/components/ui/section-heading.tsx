import Link from "next/link";

/** Centred section title with an optional subtitle and "View all" link. */
export function SectionHeading({
  title,
  subtitle,
  href,
  linkLabel = "View all",
  id,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  href?: string;
  linkLabel?: string;
  /** Id for the heading, for `aria-labelledby` on the section. */
  id?: string;
}) {
  return (
    <div className="mb-9 flex flex-col items-center gap-1.5 text-center">
      <h2
        id={id}
        className="font-display text-[clamp(1.75rem,3.6vw,2.625rem)] leading-[1.08] font-medium tracking-[-0.02em] text-green"
      >
        {title}
      </h2>
      {subtitle && <p className="text-body text-ink-secondary">{subtitle}</p>}
      {href && (
        <Link
          href={href}
          className="mt-1.5 border-b-2 border-yellow pb-0.5 text-caption text-ink uppercase transition-colors hover:border-purple hover:text-purple"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
