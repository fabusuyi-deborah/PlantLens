/** Scalloped edge path across a 1440×30 box: bumps along the top or bottom of a band. */
function wavePath(edge: "top" | "bottom") {
  const bumps = 14;
  const width = 1440 / bumps;
  let d = edge === "top" ? "M0 30 L0 18" : "M0 0 L0 12";
  for (let i = 0; i < bumps; i++) {
    const x = i * width;
    d +=
      edge === "top"
        ? ` Q ${x + width / 2} ${i % 2 ? 2 : 6} ${x + width} 18`
        : ` Q ${x + width / 2} ${i % 2 ? 28 : 24} ${x + width} 12`;
  }
  return d + (edge === "top" ? " L1440 30 Z" : " L1440 0 Z");
}

const TOP = wavePath("top");
const BOTTOM = wavePath("bottom");

const tones = {
  green: { fill: "fill-green", bg: "bg-green" },
  purple: { fill: "fill-purple", bg: "bg-purple" },
};

/** Full-width colour band with wavy top and bottom edges. Text inside is white. */
export function WaveBand({
  tone = "green",
  bottom = true,
  className = "",
  children,
  ...rest
}: {
  tone?: keyof typeof tones;
  /** Set false when the band runs into the page's last edge (e.g. the footer). */
  bottom?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const { fill, bg } = tones[tone];
  return (
    <section className={`relative text-paper ${className}`} {...rest}>
      <svg
        className={`-mb-px block h-[30px] w-full ${fill}`}
        viewBox="0 0 1440 30"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={TOP} />
      </svg>
      <div className={bg}>{children}</div>
      {bottom && (
        <svg
          className={`-mt-px block h-[30px] w-full ${fill}`}
          viewBox="0 0 1440 30"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d={BOTTOM} />
        </svg>
      )}
    </section>
  );
}
