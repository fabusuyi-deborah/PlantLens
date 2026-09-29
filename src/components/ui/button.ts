const base =
  "inline-flex items-center justify-center gap-2 rounded-sm text-body font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants = {
  primary: "bg-accent text-white hover:bg-accent-dark",
  secondary: "border border-border bg-bg text-ink-secondary hover:border-ink-muted hover:text-ink",
  danger: "bg-danger text-white hover:bg-red-700",
};

const sizes = {
  md: "h-10 px-4",
  sm: "h-9 px-3",
};

/** Button classes, usable on <button>, <a> and <Link>. */
export function buttonStyles({
  variant = "primary",
  size = "md",
}: { variant?: keyof typeof variants; size?: keyof typeof sizes } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}
