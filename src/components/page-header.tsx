/** Title block at the top of a content page. */
export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header>
      <h1 className="text-[2rem] leading-tight font-bold tracking-[-0.8px] text-ink sm:text-page-title">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-body-lg text-ink-secondary">{subtitle}</p>
    </header>
  );
}
