/** Centred title block at the top of a content page (Categories, About, Sources). */
export function PageHeader({ title, subtitle }: { title: React.ReactNode; subtitle: React.ReactNode }) {
  return (
    <header className="mx-auto flex max-w-300 flex-col items-center gap-3.5 px-4 pt-9 pb-7 text-center sm:gap-4.5 sm:pt-14 md:px-8">
      <h1 className="max-w-[18ch] font-display text-[clamp(2.375rem,6vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.035em] text-green">
        {title}
      </h1>
      <p className="max-w-[36em] text-body text-ink-secondary sm:text-lg">{subtitle}</p>
    </header>
  );
}
