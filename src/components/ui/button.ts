const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[0.12em] transition-[background-color,color,border-color,transform] duration-200 disabled:cursor-default disabled:opacity-40";

const variants = {
  /** Yellow pill: the main call to action. */
  primary: "bg-yellow text-ink hover:-translate-y-0.5 hover:bg-pink",
  /** Green outline, on light backgrounds. */
  secondary: "border-[1.5px] border-green text-green hover:bg-green hover:text-paper",
  /** White outline, on green or purple bands. */
  onDark: "border-[1.5px] border-paper/70 text-paper hover:bg-paper hover:text-purple",
  danger: "bg-danger text-paper hover:bg-red-800",
};

const sizes = {
  md: "min-h-12 px-6 text-caption",
  sm: "min-h-10 px-4 text-[0.6875rem]",
};

/** Pill button classes, usable on <button>, <a> and <Link>. */
export function buttonStyles({
  variant = "primary",
  size = "md",
}: { variant?: keyof typeof variants; size?: keyof typeof sizes } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

/** Rounded filter chip. Pass `aria-pressed` / `aria-current` on the element for the active look. */
export const chipStyles =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full border-[1.5px] border-green px-4 text-body-sm font-bold text-green transition-colors hover:border-pink hover:bg-pink hover:text-ink aria-pressed:border-green aria-pressed:bg-green aria-pressed:text-paper aria-[current=page]:border-green aria-[current=page]:bg-green aria-[current=page]:text-paper";

/** Round icon button (carousel arrows, pause, close). */
export const roundButtonStyles =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-current transition-colors";

/** Hover for a round button on a green or purple band: fills white. Add it alongside roundButtonStyles. */
export const roundButtonOnDarkHover = "hover:bg-paper hover:text-green";
