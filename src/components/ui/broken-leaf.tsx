import { useId } from "react";

// The PlantLens logo leaf (Lucide's "leaf"), cracked along this line into two pieces.
const LEAF = "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z";
const STEM = "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12";
const CRACK = "6,2 9.4,5.6 12.2,8.6 10.9,10.9 15.1,11.7 13.9,14.2 24,16.4";

const INK = "#0E5A38";
const RUST = "#B5652C";
const RUST_DARK = "#9A4A22";

/** A rusted, broken PlantLens leaf for 404 and empty states. */
export function BrokenLeaf({
  size = 120,
  label = "A broken, wilted leaf",
  className = "",
}: {
  size?: number;
  label?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const leafClip = `${id}-leaf`;
  const tipClip = `${id}-tip`;
  const baseClip = `${id}-base`;

  return (
    <svg
      className={`broken-leaf h-auto max-w-full ${className}`}
      width={size}
      height={size}
      viewBox="-2 -2 30 30"
      role="img"
      aria-label={label}
    >
      <defs>
        <clipPath id={leafClip}>
          <path d={LEAF} />
        </clipPath>
        <clipPath id={tipClip}>
          <polygon points={`6,-3 ${CRACK} 27,-3`} />
        </clipPath>
        <clipPath id={baseClip}>
          <polygon points={`-3,-3 6,-3 ${CRACK} 27,27 -3,27`} />
        </clipPath>
      </defs>

      <ellipse cx="13" cy="25.3" rx="10" ry="1.3" fill="#0B3D27" opacity=".12" />

      {/* The half still on the stem */}
      <g clipPath={`url(#${baseClip})`}>
        <path d={LEAF} fill="#E3B05A" />
        <circle cx="8.6" cy="15.6" r="1.25" fill={RUST} />
        <circle cx="11.6" cy="17.4" r=".75" fill={RUST} />
        <circle cx="6.9" cy="11.2" r=".6" fill={RUST} />
        <circle cx="13.6" cy="15.6" r=".5" fill={RUST_DARK} />
        <path d={LEAF} fill="none" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <g clipPath={`url(#${leafClip})`}>
        <polyline
          points={CRACK}
          fill="none"
          stroke={INK}
          strokeWidth="1.1"
          strokeLinejoin="round"
          clipPath={`url(#${baseClip})`}
        />
      </g>
      <path d={STEM} fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />

      {/* The snapped-off tip, drifting away */}
      <g className="leaf-tip">
        <g clipPath={`url(#${tipClip})`}>
          <path d={LEAF} fill="#D9963F" />
          <circle cx="17.6" cy="7.4" r=".9" fill={RUST_DARK} />
          <circle cx="19.4" cy="11" r=".55" fill={RUST} />
          <path d={LEAF} fill="none" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        </g>
        <g clipPath={`url(#${leafClip})`}>
          <polyline
            points={CRACK}
            fill="none"
            stroke={INK}
            strokeWidth="1.1"
            strokeLinejoin="round"
            clipPath={`url(#${tipClip})`}
          />
        </g>
      </g>

      <g className="leaf-crumbs" fill={RUST}>
        <path d="M15.4 17.6l.9.4-.5.7z" />
        <path d="M18.6 19.2l.7.2-.4.6z" />
        <circle cx="17" cy="21" r=".35" />
      </g>
    </svg>
  );
}
